export default function FileLoader({
  onLoad,
}: {
  onLoad: (s: string) => void;
}) {
  return (
    <label className="px-3 py-2 border rounded-xl bg-white cursor-pointer hover:bg-indigo-50 transition">
      <input
        type="file"
        accept=".py,.js,.ts,.jsx,.tsx,.java,.c,.cpp,.txt"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;

          try {
            const text = await f.text();
            onLoad(text);
          } catch (err) {
            console.error("Error reading file:", err);
            alert("Failed to read the selected file.");
          }
        }}
      />
      Upload file
    </label>
  );
}
