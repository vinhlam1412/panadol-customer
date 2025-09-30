import { useState, useRef, useEffect } from "react";

export default function AutoResizeInput({ value, onChange, placeholder, disabled, error }) {
  const [width, setWidth] = useState(0);
  const spanRef = useRef(null);

  useEffect(() => {
    const pad = 24 + 16; // px-4 (16) + icon/biên độ nhỏ (24) => tuỳ bạn tinh chỉnh
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth + pad);
    }
  }, [value, placeholder]);

  // (khuyến nghị) cập nhật khi resize cửa sổ
  useEffect(() => {
    const onResize = () => {
      // ép reflow đo lại
      setWidth((w) => w); 
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative w-full">
      {/* span ẩn để đo nội dung, cần giống font/size/padding của input */}
      <span
        ref={spanRef}
        className="absolute invisible whitespace-pre text-sm px-4 py-3 border rounded-xl"
      >
        {value || placeholder || ""}
      </span>

      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        // width theo nội dung; max-width bị chặn bởi container (w-full của wrapper và max-w-full)
        style={{ width: width || undefined }}
        className={`block w-auto max-w-full rounded-xl border px-4 py-3 text-sm ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
