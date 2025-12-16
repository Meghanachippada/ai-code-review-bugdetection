# server-python/main.py

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy.orm import Session
import subprocess, tempfile, json, ast, os, re, io, contextlib
from typing import Optional

from database import Base, engine, get_db
from routes import sessions
from models import CodeAnalysis
from auth import router as auth_router, User, get_optional_user


# Load environment variables
load_dotenv()

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI Code Review & Bug Detection Platform",
    description="Analyze code with AI, track user sessions, and store analysis results securely.",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(sessions.router)


# ---------------------------
# AI CODE ANALYSIS MODEL
# ---------------------------
class AnalyzeRequest(BaseModel):
    language: str
    content: str


def ai_suggestions(code: str, issues: list):
    if not code.strip():
        return "No code provided for review."
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        preview = "\n".join(code.splitlines()[:300])
        prompt = (
            "You are a senior software reviewer.\n"
            "Provide concise numbered review points covering:\n"
            "- Syntax problems\n"
            "- Runtime or logic errors\n"
            "- Readability & maintainability\n"
            "- Security risks\n"
            "- Optimization suggestions\n\n"
            f"Code:\n{preview}\n\n"
            f"Static/Runtime Analysis:\n{json.dumps(issues, indent=2)}"
        )
        res = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=400,
        )
        return res.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ AI feedback unavailable: {e}"


@app.get("/")
def root():
    return {"message": "🚀 Backend is running successfully!"}


# ---------------------------------------------------------
# FIXED ANALYZE ROUTE — Must be EXACTLY "/analyze"
# Allows anonymous users
# Saves only when logged in
# ---------------------------------------------------------
@app.post("/analyze")
def analyze_code(
    req: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)   # anonymous OK
):
    results = []
    code = req.content
    lang = req.language.lower()

    if not code.strip():
        raise HTTPException(status_code=400, detail="No code entered for analysis.")

    compiler, ext = None, None

    # ---------------------------
    # PYTHON
    # ---------------------------
    if "python" in lang:
        try:
            ast.parse(code)
        except SyntaxError as e:
            results.append({
                "line": e.lineno or 0,
                "type": "syntax",
                "message": e.msg,
                "severity": "error"
            })
        try:
            f = io.StringIO()
            with contextlib.redirect_stdout(f):
                exec(code, {})
        except Exception as e:
            results.append({
                "line": 0,
                "type": "runtime",
                "message": str(e),
                "severity": "error"
            })

    # ---------------------------
    # JAVA
    # ---------------------------
    elif "java" in lang:
        with tempfile.TemporaryDirectory() as tmpdir:
            match = re.search(r"class\s+([A-Za-z_][A-Za-z0-9_]*)", code)
            class_name = match.group(1) if match else "Temp"
            src_path = os.path.join(tmpdir, f"{class_name}.java")
            with open(src_path, "w") as f:
                f.write(code)

            proc = subprocess.run(["javac", src_path], capture_output=True, text=True)
            if proc.returncode != 0:
                for line in proc.stderr.splitlines():
                    m = re.search(rf"{class_name}\.java:(\d+): (error|warning): (.*)", line)
                    if m:
                        results.append({
                            "line": int(m.group(1)),
                            "type": "syntax",
                            "message": m.group(3).strip(),
                            "severity": "error"
                        })
            else:
                run = subprocess.run(["java", "-cp", tmpdir, class_name],
                                     capture_output=True, text=True)
                if run.returncode != 0:
                    msg = run.stderr.strip() or "Runtime exception occurred."
                    results.append({"type": "runtime", "message": msg, "severity": "error"})
                elif run.stdout.strip():
                    results.append({"type": "output", "message": run.stdout.strip(), "severity": "info"})

    # ---------------------------
    # JAVASCRIPT / TYPESCRIPT
    # ---------------------------
    elif any(x in lang for x in ["javascript", "typescript", "js"]):
        with tempfile.NamedTemporaryFile(suffix=".js", delete=False) as f:
            f.write(code.encode())
            f.flush()

        syntax_check = subprocess.run(
            ["/Users/meghanach.b/.npm-global/bin/esvalidate", f.name],
            capture_output=True, text=True
        )
        if syntax_check.returncode != 0:
            msg = syntax_check.stderr.strip() or syntax_check.stdout.strip()
            line_match = re.search(r":(\d+):", msg)
            line_num = int(line_match.group(1)) if line_match else 1
            results.append({"line": line_num, "type": "syntax", "message": msg, "severity": "error"})
        else:
            run = subprocess.run(["node", f.name], capture_output=True, text=True)
            if run.returncode != 0:
                msg = run.stderr.strip() or "Runtime error occurred."
                results.append({"type": "runtime", "message": msg, "severity": "error"})
            elif run.stdout.strip():
                results.append({"type": "output", "message": run.stdout.strip(), "severity": "info"})

    # ---------------------------
    # C / C++
    # ---------------------------
    elif "c++" in lang or "cpp" in lang:
        ext, compiler = ".cpp", "g++"
    elif "c" in lang:
        ext, compiler = ".c", "gcc"

    if compiler:
        with tempfile.TemporaryDirectory() as tmpdir:
            src = os.path.join(tmpdir, f"Temp{ext}")
            exe = os.path.join(tmpdir, "a.out")
            with open(src, "w") as f:
                wrapped_code = code.strip()
                if not re.search(r"\bmain\s*\(", wrapped_code):
                    wrapped_code = f"#include <stdio.h>\nint main(){{\n{wrapped_code}\nreturn 0;\n}}"
                f.write(wrapped_code)

            compile_proc = subprocess.run([compiler, src, "-o", exe],
                capture_output=True, text=True)
            if compile_proc.returncode != 0:
                for line in compile_proc.stderr.splitlines():
                    if ":" in line:
                        parts = line.split(":")
                        line_num = int(parts[1]) if parts[1].isdigit() else 0
                        msg = ":".join(parts[2:]).strip()
                        results.append({"line": line_num, "type": "syntax", "message": msg, "severity": "error"})
            else:
                run_proc = subprocess.run([exe], capture_output=True, text=True)
                if run_proc.returncode < 0:
                    sig = abs(run_proc.returncode)
                    msg = "Segmentation fault" if sig == 11 else f"Terminated by signal {sig}"
                    results.append({"type": "runtime", "message": msg, "severity": "error"})
                elif run_proc.returncode != 0:
                    results.append({"type": "runtime", "message": run_proc.stderr.strip(), "severity": "error"})
                elif run_proc.stdout.strip():
                    results.append({"type": "output", "message": run_proc.stdout.strip(), "severity": "info"})

    # ---------------------------
    # AI FEEDBACK
    # ---------------------------
    ai_feedback = ai_suggestions(code, results)

    # ---------------------------
    # SAVE ONLY IF LOGGED IN
    # ---------------------------
    if current_user:
        try:
            analysis = CodeAnalysis(
                language=req.language,
                issues=results,
                ai_feedback=ai_feedback,
                snippet=code,
                user_id=current_user.id,
            )
            db.add(analysis)
            db.commit()
        except Exception as e:
            print(f"⚠️ Error saving analysis: {e}")

    return {
        "issues": results,
        "ai_feedback": ai_feedback,
        "saved": bool(current_user),
        "message": "Analysis completed successfully"
    }
