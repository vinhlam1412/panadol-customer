import React, { useEffect, useMemo, useState } from "react";
import { Box, Page, Spinner } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import MainHeader from "../components/main-header";
import { userState } from "../state";
import banner from "../images/banner.jpg";
import { QRCodeSVG } from "qrcode.react";

const STAR_COLOR = "#ca0600";

const extractTopics = (detail) => {
  let arr = [];
  if (Array.isArray(detail?.q7Topics)) {
    arr = detail.q7Topics;
  } else if (Array.isArray(detail?.q7_selected)) {
    arr = detail.q7_selected;
  } else if (typeof detail?.q7TopicsJson === "string") {
    try {
      const parsed = JSON.parse(detail.q7TopicsJson); // kỳ vọng là mảng chuỗi
      if (Array.isArray(parsed)) arr = parsed;
    } catch (e) {
      // fallback: nếu backend trả không chuẩn JSON
      arr = detail.q7TopicsJson.split(","); 
    }
  }
  // Loại bỏ ký tự "\" thừa và trim
  return arr
    .filter(Boolean)
    .map((s) => String(s).replace(/\\/g, "").trim());
};

const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-7 w-7 drop-shadow-sm"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "currentColor" : "#cbd5e1"}
    color={filled ? STAR_COLOR : undefined}
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.1 5.062a.563.563 0 0 0 .475.345l5.462.397c.499.036.701.663.321.988l-4.17 3.538a.563.563 0 0 0-.182.557l1.277 5.27a.562.562 0 0 1-.84.61l-4.727-2.83a.563.563 0 0 0-.586 0l-4.727 2.83a.562.562 0 0 1-.84-.61l1.277-5.27a.563.563 0 0 0-.182-.557L2.122 10.29a.563.563 0 0 1 .321-.988l5.462-.397a.563.563 0 0 0 .475-.345l2.1-5.062Z"
    />
  </svg>
);

// ⭐ Thêm prop readOnly để khóa tương tác khi hiển thị kết quả
const StarRow = ({ value, onChange, ariaLabelPrefix = "Chọn", readOnly = false }) => {
  const [hover, setHover] = useState(null);
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);
  const current = readOnly ? value : (hover ?? value);

  return (
    <div className="mt-2 flex items-center gap-2">
      {stars.map((i) => {
        const filled = current >= i;
        return (
          <button
            key={i}
            type="button"
            aria-label={`${ariaLabelPrefix} ${i} sao`}
            onMouseEnter={() => !readOnly && setHover(i)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange(i)}
            className={`p-1 ${readOnly ? "cursor-default" : ""}`}
            disabled={readOnly}
          >
            <Star filled={filled} />
          </button>
        );
      })}
      <span className="ml-2 text-slate-400 text-sm">{value}/5</span>
    </div>
  );
};

const Q7_OPTIONS = [
  "Giao lưu – truyền cảm hứng",
  "Kiến thức chuyên môn cập nhật",
  "Kỹ năng tư vấn thuốc",
  "Sức khỏe tinh thần – chăm sóc bản thân",
  "Luật Dược",
];



export const SurveyPage = () => {
  const navigate = useNavigate();
  const userInfor = useRecoilValue(userState);

  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [q3, setQ3] = useState(0);
  const [q4, setQ4] = useState(0);
  const [q5, setQ5] = useState(0);
  const [q6, setQ6] = useState(0);

  const [q7, setQ7] = useState([]);
  const [q7Other, setQ7Other] = useState("");
  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔒 Chế độ xem lại câu trả lời (đã gửi)
  const [readOnly, setReadOnly] = useState(false);
  const [answersLoaded, setAnswersLoaded] = useState(false);

  const allRated = q1 && q2 && q3 && q4 && q5 && q6;
  const canSubmit = allRated && !loading && !readOnly;

  const [qrData, setQrData] = useState(null);
  const controller = new AbortController();
  
  const getQRReward = async (idReward) => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/qr/reward`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rewardId: idReward,
            userId: userInfor.id,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          // TODO: show snackbar/toast if you want
          return;
        }

        const data = await res.json();
        console.log("qr reward data", data.url);
        setQrData(data.url ?? null);
      } catch (err) {
        if (err.name !== "AbortError") {
          // TODO: show snackbar/toast if you want
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

  const toggleQ7 = (opt) => {
    if (readOnly) return;
    setQ7((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const handleSurvey = async () => {
    setLoading(true);
    try {
      const payload = {
        userId: userInfor.id,
        q1,
        q2,
        q3,
        q4,
        q5,
        q6,
        q7Topics: q7,
        q7Other: q7Other?.trim() || undefined,
        feedback: feedback?.trim() || undefined,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 200) {
        const data = await res.json();
        navigate(`/qr-reward/${data.id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sửa logic CheckSurvey: nếu đã có, load câu trả lời và bật readOnly
  const CheckSurvey = async () => {
    setLoading(true);
    try {
      // 1) Kiểm tra đã làm khảo sát chưa (GET không cần body)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/check-survey?userId=${userInfor.id}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        const data = await res.json();

        if (data?.hasSurvey === true) {
          // 2) Lấy chi tiết câu trả lời
          const detailRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user/survey?userId=${userInfor.id}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );

          if (detailRes.status === 200) {
            const detail = await detailRes.json();
            getQRReward(detail.id);
            // Chuẩn hóa tên field: q7Topics / q7_selected
            const topics = detail?.q7Topics ?? detail?.q7_selected ?? [];
            setQ1(Number(detail?.q1) || 0);
            setQ2(Number(detail?.q2) || 0);
            setQ3(Number(detail?.q3) || 0);
            setQ4(Number(detail?.q4) || 0);
            setQ5(Number(detail?.q5) || 0);
            setQ6(Number(detail?.q6) || 0);
           // ✅ xử lý mọi biến thể Q7 (kể cả q7TopicsJson bị "\" chen vào)
            setQ7(extractTopics(detail));
            setQ7Other(detail?.q7Other || "");
            setFeedback(detail?.feedback || "");
            setReadOnly(true);
            setAnswersLoaded(true);
            return; // ✅ kết thúc sớm, không navigate
          } else {
            // Nếu không lấy được chi tiết, vẫn cho vào trang chủ để tránh kẹt
            navigate("/");
            return;
          }
        }
        // Chưa làm khảo sát => cho làm bình thường
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    CheckSurvey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Page
        className="page text-center !p-0 !m-0"
        style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}
      >
        <Box flex flexDirection="column" justifyContent="center" alignItems="center">
          <Spinner visible />
        </Box>
      </Page>
    );
  }

  return (
    <Page className="page bg-primary !p-0 relative overflow-x-hidden">
      <MainHeader title="Khảo sát" />
      <div className="bg-white overflow-x-hidden px-3 w-full">
        <div className="mt-1 pt-1 mx-auto">
          <img src={banner} alt="banner" className="object-cover h-[15%] w-full rounded-2xl" />
        </div>

        {/* Thông báo đã hoàn thành */}
        {readOnly && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="font-semibold">Bạn đã hoàn thành khảo sát.</div>
            <div className="text-sm opacity-90">
              Dưới đây là các câu trả lời bạn đã gửi{answersLoaded ? "" : "…"}.
            </div>
          </div>
        )}

        {/* 🔥 Phần mô tả */}
        {!readOnly && (
          <div className="mt-6 bg-slate-50 rounded-xl p-4 text-slate-700">
            <h2 className="text-xl font-bold text-primary mb-3">Khảo sát về chương trình “Người Giảm Đau”</h2>
            <p className="mb-3">Cảm ơn Quý Dược sĩ đã tham dự chương trình hội thảo</p>
            <blockquote className="italic text-slate-600 mb-3">
              “Từ cảm xúc đến chuyên môn – Giải pháp giảm đau giúp Dược sĩ nhà thuốc chăm sóc bản thân và cộng đồng.”
            </blockquote>
            <p className="mb-3">
              💬 Chúng tôi rất mong nhận được những góp ý chân thành từ Quý Dược sĩ để chương trình <b>“Người Giảm Đau”</b> trong tương lai được hoàn thiện hơn, đồng hành thiết thực và ý nghĩa hơn với cộng đồng Dược sĩ nhà thuốc.
            </p>
            <p className="text-sm text-slate-500">
              🕐 Khảo sát gồm một vài câu hỏi ngắn, mất khoảng 2–3 phút để hoàn thành. Mọi thông tin phản hồi sẽ được bảo mật và chỉ phục vụ cho mục đích nâng cao chất lượng chương trình.
            </p>
          </div>
        )}

        <main className="min-h-screen flex items-start justify-center p-2">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-5">
            <h1 className="text-center text-2xl font-semibold text-primary">Khảo sát</h1>

            {/* Q1 */}
            <section className="mt-6">
              <div className="text-sm font-medium text-slate-700">
                1. Tôi cảm thấy <b>NGƯỜI GIẢM ĐAU</b> đã đồng hành và tri ân vai trò và giá trị của Dược sĩ nhà thuốc
                <span className="block text-xs text-slate-500 mt-1">(1 sao: Không hài lòng – 5 sao: Rất hài lòng)</span>
              </div>
              <StarRow value={q1} onChange={setQ1} ariaLabelPrefix="Q1 chọn" readOnly={readOnly} />
            </section>

            {/* Q2 */}
            <section className="mt-6">
              <div className="text-sm font-medium text-slate-700">
                2. “Giảm đau tinh thần: Giải pháp chăm sóc cảm xúc nghề Dược” rất hữu ích và liên quan đến tôi
                <span className="block text-xs text-slate-500 mt-1">(1 sao: Không hài lòng – 5 sao: Rất hài lòng)</span>
              </div>
              <StarRow value={q2} onChange={setQ2} ariaLabelPrefix="Q2 chọn" readOnly={readOnly} />
            </section>

            {/* Q3 */}
            <section className="mt-6">
              <div className="text-sm font-medium text-slate-700">
                3. “Tác động giảm đau & hạ sốt của Paracetamol” rất hữu ích và liên quan đến tôi
                <span className="block text-xs text-slate-500 mt-1">(1–5 sao)</span>
              </div>
              <StarRow value={q3} onChange={setQ3} ariaLabelPrefix="Q3 chọn" readOnly={readOnly} />
            </section>

            {/* Q4 */}
            <section className="mt-6">
              <div className="text-sm font-medium text-slate-700">
                4. Haleon truyền cảm hứng để tôi trở thành “Người Giảm Đau” – một Dược sĩ nhà thuốc thấu cảm và chăm sóc bệnh nhân tốt hơn
                <span className="block text-xs text-slate-500 mt-1">(1–5 sao)</span>
              </div>
              <StarRow value={q4} onChange={setQ4} ariaLabelPrefix="Q4 chọn" readOnly={readOnly} />
            </section>

            {/* Q5 */}
            <section className="mt-6">
              <div className="text-sm font-medium text-slate-700">
                5. Sau chương trình, tôi dự định áp dụng kiến thức từ chương trình “Người Giảm Đau – Sống nghề dược, cho người, cho mình” tại nhà thuốc để tư vấn cho bệnh nhân tốt hơn
                <span className="block text-xs text-slate-500 mt-1">(1–5 sao)</span>
              </div>
              <StarRow value={q5} onChange={setQ5} ariaLabelPrefix="Q5 chọn" readOnly={readOnly} />
            </section>

            {/* Q6 */}
            <section className="mt-6">
              <div className="text-sm font-medium text-slate-700">
                6. Tôi sẵn sàng giới thiệu đồng nghiệp Dược sĩ biết về chương trình “Người Giảm Đau”
                <span className="block text-xs text-slate-500 mt-1">(1–5 sao)</span>
              </div>
              <StarRow value={q6} onChange={setQ6} ariaLabelPrefix="Q6 chọn" readOnly={readOnly} />
            </section>

            {/* Q7 */}
            <section className="mt-8">
              <div className="text-sm font-medium text-slate-700">
                7. Anh/chị mong muốn nội dung/hoạt động nào trong các hội thảo tiếp theo? (có thể chọn nhiều đáp án)
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Q7_OPTIONS.map((opt) => (
                  <label key={opt} className={`flex items-center gap-2 rounded-xl border ${q7.includes(opt) ? "border-primary" : "border-slate-300"} px-3 py-2`}>
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[--zmp-primary-color,#ca0600]"
                      checked={q7.includes(opt)}
                      onChange={() => toggleQ7(opt)}
                      disabled={readOnly}
                    />
                    <span className="text-sm text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>

              <div className="mt-3">
                <label className="text-sm text-slate-700">Mục khác:</label>
                <input
                  type="text"
                  value={q7Other}
                  onChange={(e) => setQ7Other(e.target.value)}
                  placeholder="Nhập nội dung mong muốn khác…"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ca0600] focus:border-[#ca0600]"
                  disabled={readOnly}
                />
              </div>
            </section>

            {/* Q8 – Ý kiến khác */}
            <section className="mt-6">
              <label className="text-sm font-medium text-slate-700">Ý kiến khác về chương trình (nếu có)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Chia sẻ góp ý của bạn…"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ca0600] focus:border-[#ca0600]"
                rows={4}
                disabled={readOnly}
              />
            </section>

        {readOnly && <div className="bg-white mx-10">
          <p className="qr-code-title text-center my-4">
            <h5 className="qr-code-title text-center my-4">Mã quà tặng</h5>
          </p>
          {qrData && (
            <div className="flex items-center justify-center px-6 pb-20 pt-4">
                <QRCodeSVG width={'100%'} height={'100%'} value={qrData} fgColor={'#000000'} />
          </div>
          )}
        </div>}

            {/* Submit */}
            {!readOnly && (
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSurvey}
                className={`mt-6 w-full rounded-xl px-4 py-3 text-white bg-primary font-medium transition-colors ${
                  canSubmit ? "bg-primary hover:brightness-110 pb-20" : "bg-primary/50 cursor-not-allowed"
                }`}
              >
                Gửi
              </button>
            )}
          </div>
        </main>
      </div>
    </Page>
  );
};
