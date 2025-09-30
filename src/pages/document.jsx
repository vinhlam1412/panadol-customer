import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Page as ZPage, Spinner } from "zmp-ui";
import MainHeader from "../components/main-header";
import { useNavigate } from "react-router-dom";

/** =======================
 *  Zoomable Viewer (Modal) - React JS
 *  ======================= */
function ZoomViewer({ open, src, alt, onClose, pageLabel }) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const startRef = useRef(null);

  const pinchRef = useRef(null);
  const lastTapRef = useRef(0);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const applyTransform = () => {
    if (!imgRef.current) return;
    // GHÉP HAI TRANSFORM: giữ tâm giữa (translate -50%,-50%) + pan/zoom
    imgRef.current.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale})`;
    imgRef.current.style.transformOrigin = "50% 50%";
  };

  useEffect(applyTransform, [scale, tx, ty]);

  const resetFit = useCallback(() => {
    if (!wrapperRef.current || !imgRef.current) return;
    const wrap = wrapperRef.current.getBoundingClientRect();
    const naturalW = imgRef.current.naturalWidth || 1;
    const naturalH = imgRef.current.naturalHeight || 1;
    // Fit theo chiều ngắn hơn
    const s = Math.min(wrap.width / naturalW, wrap.height / naturalH);
    setScale(s);
    setTx(0);
    setTy(0);
  }, []);

  const set100 = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  // Khóa scroll body khi mở modal (đỡ trôi trên mobile)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(resetFit, 0);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, resetFit, src]);

  const zoomAtPoint = (delta, clientX, clientY) => {
    if (!wrapperRef.current || !imgRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    // toạ độ điểm zoom tính từ tâm hiện tại
    const originX = clientX - rect.left - rect.width / 2 - tx;
    const originY = clientY - rect.top - rect.height / 2 - ty;

    const newScale = clamp(scale * (delta > 0 ? 0.9 : 1.1), 0.1, 8);
    const k = newScale / scale;

    const newTx = tx - originX * (k - 1);
    const newTy = ty - originY * (k - 1);

    setScale(newScale);
    setTx(newTx);
    setTy(newTy);
  };

  const onWheel = (e) => {
    e.preventDefault();
    zoomAtPoint(e.deltaY, e.clientX, e.clientY);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    setIsPanning(true);
    startRef.current = { x: e.clientX, y: e.clientY, tx, ty };
  };
  const onMouseMove = (e) => {
    if (!isPanning || !startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setTx(startRef.current.tx + dx);
    setTy(startRef.current.ty + dy);
  };
  const onMouseUp = () => {
    setIsPanning(false);
    startRef.current = null;
  };

  // ---- Mobile gestures (pinch / double-tap / pan) ----
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      const t = Date.now();
      // double-tap zoom in
      if (t - lastTapRef.current < 300) {
        const touch = e.touches[0];
        zoomAtPoint(-1, touch.clientX, touch.clientY);
      }
      lastTapRef.current = t;

      startRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        tx,
        ty,
      };
      setIsPanning(true);
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      const a = e.touches[0];
      const b = e.touches[1];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const cx = (a.clientX + b.clientX) / 2;
      const cy = (a.clientY + b.clientY) / 2;
      pinchRef.current = { dist, scaleStart: scale, cx, cy };
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 1 && isPanning && startRef.current) {
      const dx = e.touches[0].clientX - startRef.current.x;
      const dy = e.touches[0].clientY - startRef.current.y;
      setTx(startRef.current.tx + dx);
      setTy(startRef.current.ty + dy);
    } else if (e.touches.length === 2 && pinchRef.current) {
      const a = e.touches[0];
      const b = e.touches[1];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const factor = dist / pinchRef.current.dist;
      const newScale = clamp(pinchRef.current.scaleStart * factor, 0.1, 8);

      // zoom quanh tâm pinch
      const cx = (a.clientX + b.clientX) / 2;
      const cy = (a.clientY + b.clientY) / 2;

      const rect = wrapperRef.current.getBoundingClientRect();
      const originX = cx - rect.left - rect.width / 2 - tx;
      const originY = cy - rect.top - rect.height / 2 - ty;

      const k = newScale / scale;
      const newTx = tx - originX * (k - 1);
      const newTy = ty - originY * (k - 1);

      setScale(newScale);
      setTx(newTx);
      setTy(newTy);
    }
  };

  const onTouchEnd = () => {
    setIsPanning(false);
    startRef.current = null;
    pinchRef.current = null;
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+") setScale((s) => clamp(s * 1.1, 0.1, 8));
      if (e.key === "-") setScale((s) => clamp(s * 0.9, 0.1, 8));
      if (e.key.toLowerCase() === "f") resetFit();
      if (e.key === "1") set100();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, resetFit, set100]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col">
      {/* Top bar (gọn cho mobile) */}
      <div className="flex items-center justify-between px-3 pt-3 text-white">
        <div className="text-xs sm:text-sm opacity-90 truncate max-w-[60%]">
          {pageLabel || alt}
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Khu vực canvas: chặn scroll, ưu tiên gesture */}
      <div
        ref={wrapperRef}
        className="relative flex-1 overflow-hidden touch-none overscroll-contain"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="select-none pointer-events-none absolute"
          // Đặt tâm ảnh đúng giữa khung
          style={{
            top: "50%",
            left: "50%",
            width: "auto",
            height: "auto",
            maxWidth: "none",
            maxHeight: "none",
            transform: "translate(-50%, -50%)",
            willChange: "transform",
          }}
          onLoad={() => {
            setTx(0);
            setTy(0);
            setTimeout(resetFit, 0);
          }}
        />
      </div>

      {/* Bottom toolbar: dễ bấm trên điện thoại */}
      <div
        className="flex items-center justify-center gap-2 p-2 pb-[calc(env(safe-area-inset-bottom)+8px)]"
      >
        <button
          onClick={() => setScale((s) => clamp(s * 0.9, 0.1, 8))}
          className="px-4 py-2 rounded-xl bg-white text-black text-base"
          aria-label="Zoom out"
        >
          −
        </button>
        <div className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs min-w-[64px] text-center">
          {(scale * 100).toFixed(0)}%
        </div>
        <button
          onClick={() => setScale((s) => clamp(s * 1.1, 0.1, 8))}
          className="px-4 py-2 rounded-xl bg-white text-black text-base"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={resetFit}
          className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs"
          title="Fit"
        >
          Fit
        </button>
        <button
          onClick={set100}
          className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs"
          title="1:1"
        >
          1:1
        </button>
        <button
          onClick={() => document.documentElement.requestFullscreen?.()}
          className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs"
          title="Fullscreen"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}

/** =======================
 *  Main Page - React JS
 *  ======================= */
export default function ProgramDocumentPage() {
  const navigate = useNavigate();

  // --- Lấy ảnh từ src/docs bằng Vite glob (ưu tiên) ---
  const modules = import.meta.glob("../docs/550C2LINE-*.{png,jpg,jpeg,webp}", {
    eager: true,
    import: "default",
  });

  const imagesFromSrc = useMemo(() => {
    const arr = Object.entries(modules).map(([path, url]) => {
      const m = path.match(/550C2LINE-(\d+)/i);
      const idx = m ? parseInt(m[1], 10) : 0;
      return { idx, url: url, label: String(idx).padStart(2, "0") };
    });
    arr.sort((a, b) => a.idx - b.idx);
    return arr;
  }, [modules]);

  // --- Fallback: nếu không có ảnh trong src/, dùng public/ ---
  const fallbackFromPublic = useMemo(() => {
    if (imagesFromSrc.length > 0) return [];
    const count = 47;
    return Array.from({ length: count }, (_, i) => {
      const label = String(i + 1).padStart(2, "0");
      return { idx: i + 1, url: `/docs/550C2LINE-${label}.jpg`, label };
    });
  }, [imagesFromSrc.length]);

  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (loadedCount > 0) setLoading(false);
  }, [loadedCount]);

  const handleImgError = (e, label) => {
    const img = e.currentTarget;
    const tried = img.dataset.tried ? img.dataset.tried.split(",") : [];
    const candidates = [".jpg", ".png", ".jpeg", ".webp"];
    const next = candidates.find((ext) => !tried.includes(ext));
    if (next) {
      img.dataset.tried = [...tried, next].join(",");
      img.src = `/docs/550C2LINE-${label}${next}`;
    } else {
      setLoadedCount((c) => c + 1);
    }
  };

  // ====== Zoom Viewer State ======
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSrc, setViewerSrc] = useState("");
  const [viewerLabel, setViewerLabel] = useState("");

  const openViewer = (src, label) => {
    setViewerSrc(src);
    setViewerLabel(label);
    setViewerOpen(true);
  };

  return (
    <ZPage className="page !p-0 !m-0">
      <MainHeader title="Tài liệu chương trình" />

      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        {/* Header */}
        <div className="w-full max-w-4xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">Tài liệu (47 trang)</h3>
            <div className="text-xs text-slate-500">Bấm vào ảnh để phóng to</div>
          </div>
        </div>

        {/* Viewer (cuộn dọc, snap từng trang) */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 px-4 pb-4 mt-4">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-xl">
              <Box flex flexDirection="column" justifyContent="center" alignItems="center">
                <Spinner visible />
                <div className="mt-2 text-xs text-slate-600">Đang tải hình ảnh…</div>
              </Box>
            </div>
          )}

          <div
            className="
              rounded-xl bg-white shadow-sm ring-1 ring-black/5
              h-[calc(100vh-220px)] overflow-y-auto
              snap-y snap-mandatory
            "
          >
            {/* src/docs (glob) */}
            {imagesFromSrc.length > 0
              ? imagesFromSrc.map(({ idx, url, label }) => (
                  <div key={idx} className="snap-start p-3 border-b border-slate-100 last:border-b-0">
                    <img
                      src={url}
                      alt={`Trang ${label}`}
                      className="w-full h-auto rounded-lg cursor-zoom-in"
                      loading="lazy"
                      onLoad={() => setLoadedCount((c) => c + 1)}
                      onError={() => setLoadedCount((c) => c + 1)}
                      onClick={() => openViewer(url, `Trang ${label}`)}
                    />
                    <div className="mt-2 text-xs text-slate-500 text-center">Trang {label}</div>
                  </div>
                ))
              : // public/docs fallback
                Array.from({ length: 47 }, (_, i) => {
                  const label = String(i + 1).padStart(2, "0");
                  const jpg = `/docs/550C2LINE-${label}.jpg`;
                  return (
                    <div key={label} className="snap-start p-3 border-b border-slate-100 last:border-b-0">
                      <picture>
                        <source srcSet={`/docs/550C2LINE-${label}.webp`} type="image/webp" />
                        <img
                          src={jpg}
                          alt={`Trang ${label}`}
                          className="w-full h-auto rounded-lg cursor-zoom-in"
                          loading="lazy"
                          data-tried=".jpg"
                          onLoad={() => setLoadedCount((c) => c + 1)}
                          onError={(e) => handleImgError(e, label)}
                          onClick={(e) => openViewer(e.target.src, `Trang ${label}`)}
                        />
                      </picture>
                      <div className="mt-2 text-xs text-slate-500 text-center">Trang {label}</div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Nút trở về */}
        <div className="flex items-end justify-end w-full p-4 bg-slate-50">
          <button
            onClick={() => navigate("/")}
            className="text-white font-bold bg-primary rounded-2xl px-4 py-2"
          >
            Trở về
          </button>
        </div>
      </div>

      {/* Modal Zoom Viewer */}
      <ZoomViewer
        open={viewerOpen}
        src={viewerSrc}
        alt={viewerLabel}
        pageLabel={viewerLabel}
        onClose={() => setViewerOpen(false)}
      />
    </ZPage>
  );
}
