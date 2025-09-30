import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Bookmark,
  Syringe,
  CalendarDays,
  User2,
  FileCheck2,
  MailX,
  Upload,
  ShieldCheck,
  BadgeCheck,
  LogIn,
  ChevronDown,
  ChevronRight,
  Search,
  Highlighter,
  Activity,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

// ==== THEME (Red tone + glass & subtle effects) ====
const MAIN = "#cc0000"; // primary red
const GRADIENT = "linear-gradient(145deg, #ff4d4d, #cc0000)";
const GLASS = "backdrop-filter: blur(8px); background: rgba(255,255,255,0.9);";

// ==== Lightweight UI Primitives (self-contained) ====
const Card = ({ className = "", children, style }) => (
  <div
    className={`rounded-2xl shadow-md bg-white/90 backdrop-blur-md ${className}`}
    style={style}
  >
    {children}
  </div>
);
const CardContent = ({ className = "", children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
const Button = ({ className = "", children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-3 py-2 rounded-2xl text-white font-medium shadow transition-all hover:scale-105 hover:brightness-110 ${className}`}
    style={{ background: GRADIENT, boxShadow: "0 6px 18px rgba(204,0,0,0.25)" }}
  >
    {children}
  </button>
);
const Input = (props) => (
  <input
    {...props}
    className={`w-full border rounded-xl px-3 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/85 backdrop-blur-sm ${
      props.className || ""
    }`}
  />
);
const Label = ({ children, className = "" }) => (
  <label className={`block text-sm text-gray-700 mb-1 ${className}`}>{children}</label>
);
const Select = ({ value, onChange, options = [] }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none border rounded-xl px-3 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/85 backdrop-blur-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

// ==== Mock Data ====
const CATEGORIES = [
  { key: "tonghop", name: "Tổng hợp" },
  { key: "ykhoa", name: "Nổi bật" },
  { key: "rxvx", name: "Y khoa" },
  { key: "vaccine", name: "Sự kiện" },
  { key: "khangsinh", name: "Danh sách sự kiện" },
];

const ARTICLES = [
  {
    id: 1,
    category: "ykhoa",
    title: "Cập nhật hướng dẫn điều trị 2025",
    date: "12/09/2025",
    image:
      "data:image/svg+xml;utf8,\n      <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>\n        <defs>\n          <linearGradient id='g' x1='0' x2='1'>\n            <stop offset='0' stop-color='%23ff4d4d'/>\n            <stop offset='1' stop-color='%23cc0000'/>\n          </linearGradient>\n        </defs>\n        <rect width='100%' height='100%' fill='url(%23g)'/>\n        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='white' font-family='Inter,system-ui'>Y KHOA</text>\n      </svg>",
  },
  {
    id: 2,
    category: "rxvx",
    title: "Tương tác thuốc thường gặp trong y khoa",
    date: "10/09/2025",
    image:
      "data:image/svg+xml;utf8,\n      <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>\n        <defs>\n          <linearGradient id='g' x1='0' x2='1'>\n            <stop offset='0' stop-color='%23ff4d4d'/>\n            <stop offset='1' stop-color='%23cc0000'/>\n          </linearGradient>\n        </defs>\n        <rect width='100%' height='100%' fill='url(%23g)'/>\n        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='white' font-family='Inter,system-ui'>Bài viết nổi bật</text>\n      </svg>",
  },
  {
    id: 3,
    category: "vaccine",
    title: "Workshop về tiêm chủng cho người lớn",
    date: "08/09/2025",
    image:
      "data:image/svg+xml;utf8,\n      <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>\n        <defs>\n          <linearGradient id='g' x1='0' x2='1'>\n            <stop offset='0' stop-color='%23ff4d4d'/>\n            <stop offset='1' stop-color='%23cc0000'/>\n          </linearGradient>\n        </defs>\n        <rect width='100%' height='100%' fill='url(%23g)'/>\n        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='white' font-family='Inter,system-ui'>VACCINE</text>\n      </svg>",
  },
  {
    id: 4,
    category: "khangsinh",
    title: "Kháng sinh hợp lý trong điều trị ngoại trú",
    date: "07/09/2025",
    image:
      "data:image/svg+xml;utf8,\n      <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>\n        <defs>\n          <linearGradient id='g' x1='0' x2='1'>\n            <stop offset='0' stop-color='%23ff4d4d'/>\n            <stop offset='1' stop-color='%23cc0000'/>\n          </linearGradient>\n        </defs>\n        <rect width='100%' height='100%' fill='url(%23g)'/>\n        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='white' font-family='Inter,system-ui'>Kháng sinh</text>\n      </svg>",
  },
];

const UPCOMING_EVENTS = [];

// ==== Elements ====
const SectionTitle = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-2">
    {icon}
    <h3 className="text-lg font-semibold">{title}</h3>
  </div>
);

function HeaderBar({ name = "Bác sĩ" }) {
  return (
    <div className="px-4 py-4 text-white shadow-lg" style={{ background: `linear-gradient(135deg, #ff4d4d, ${MAIN})` }}>
      <div className="text-xl font-semibold drop-shadow">GSK Việt Nam</div>
      <div className="opacity-90 mt-1">Xin chào, {name} 👋</div>
    </div>
  );
}

function Banner() {
  return (
    <div className="px-4 mt-3">
      <Card className="bg-gradient-to-r from-red-100 to-red-200">
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="text-base font-medium">Cập nhật dành cho NVYT</div>
            <div className="text-sm text-gray-600 mt-1">Tin tức – sự kiện – tài liệu mới nhất</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xl font-bold shadow-inner backdrop-blur-sm">
            G
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ArticleCard({ a, onOpen }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden">
        <img src={a.image} alt={a.title} className="h-12 w-full object-cover" />
        <CardContent>
          <div className="text-[15px] font-semibold leading-snug">{a.title}</div>
          <div className="text-sm text-gray-500 mt-1">{a.date}</div>
          <div className="mt-3">
            <Button onClick={() => onOpen(a)}>Đọc bài</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ArticleDetail({ article, onBack }) {
  return (
    <div className="min-h-[70vh]">
      <div className="px-4 py-3 flex items-center gap-2 bg-red-50">
        <button onClick={onBack} className="p-1 rounded-xl bg-white shadow">
          <ChevronRight className="rotate-180" />
        </button>
        <div className="text-[15px] font-medium">{article.title}</div>
      </div>
      <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
      <div className="px-4 py-4 space-y-3">
        <div className="text-sm text-gray-500">Đăng ngày {article.date}</div>
        <p className="leading-relaxed text-[15px]">
          Nội dung minh hoạ cho bài viết. Ảnh + văn bản hiển thị đầy đủ, hỗ trợ
          định dạng cơ bản. Đây là đoạn nội dung giả để mô phỏng trải nghiệm đọc bài
          viết trong ứng dụng GSK dành cho nhân viên y tế.
        </p>
        <p className="leading-relaxed text-[15px]">
          *Tính năng:* lọc theo chuyên mục, hiển thị bài viết liên quan và nút chia sẻ.
        </p>
      </div>
    </div>
  );
}

function HomeTab() {
  const [selectedCat, setSelectedCat] = useState("tonghop");
  const [opened, setOpened] = useState(null);
  const filtered = useMemo(() => {
    if (selectedCat === "tonghop") return ARTICLES;
    return ARTICLES.filter((a) => a.category === selectedCat);
  }, [selectedCat]);

  return (
    <div className="pb-28">
      <HeaderBar />
      <Banner />

      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 overflow-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCat(c.key)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-all ${
                selectedCat === c.key ? "text-white" : "text-gray-700"
              }`}
              style={{
                background: selectedCat === c.key ? GRADIENT : "transparent",
                borderColor: MAIN,
                boxShadow: selectedCat === c.key ? "0 2px 10px rgba(204,0,0,0.25)" : "none",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {filtered.map((a) => (
            <ArticleCard key={a.id} a={a} onOpen={setOpened} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {opened && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="ml-auto w-full max-w-md bg-white overflow-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <ArticleDetail article={opened} onBack={() => setOpened(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryScreen({ catKey }) {
  const [query, setQuery] = useState("");
  const items = useMemo(
    () =>
      ARTICLES.filter((a) => (catKey === "all" ? true : a.category === catKey)).filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase())
      ),
    [catKey, query]
  );
  return (
    <div className="pb-28 min-h-[80vh]">
      <HeaderBar />
      <div className="px-4 mt-4 flex items-center gap-2">
        <div className="relative w-full">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Tìm bài viết…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="px-4 mt-4 grid grid-cols-1 gap-3">
        {items.map((a) => (
          <ArticleCard key={a.id} a={a} onOpen={() => {}} />
        ))}
        {items.length === 0 && (
          <Card>
            <CardContent className="text-center text-gray-500">Chưa có bài viết.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function EventsScreen({ userId }) {
  return (
    <div className="pb-28 min-h-[80vh]">
      <HeaderBar />
      <div className="px-4 mt-4">
        <SectionTitle title="Sự kiện sắp tới" icon={<CalendarDays className="h-5 w-5 text-red-600" />} />

        {UPCOMING_EVENTS.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <div className="text-[15px]">Không có sự kiện</div>
              <div className="text-sm text-gray-500 mt-1">Vui lòng quay lại sau.</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {UPCOMING_EVENTS.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-sm text-gray-500">
                      {e.date} · {e.location}
                    </div>
                  </div>
                  <Button>Đăng ký</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6">
          <SectionTitle title="Mã QR cá nhân để check-in" icon={<BadgeCheck className="h-5 w-5 text-red-600" />} />
          <Card>
            <CardContent className="flex flex-col items-center gap-3">
              <QRCodeCanvas value={`GSK-${userId || "USER"}`} size={140} />
              <div className="text-sm text-gray-600">Quét mã này để tham dự sự kiện</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  const [subscribed, setSubscribed] = useState(true);
  const user = {
    name: "BS. Nguyễn An",
    phone: "0909 000 000",
    email: "an.nguyen@example.com",
    specialty: "Nội tổng quát",
    dept: "Khoa Nội",
    workplace: "BV Đa khoa A",
    address: "123 Đường X, Quận Y, TP.HCM",
    verified: true,
    id: "NVYT-012345",
  };

  return (
    <div className="pb-28 min-h-[80vh]">
      <HeaderBar name={user.name} />
      
      <div className="px-4 mt-3">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-xl font-semibold" style={{ background: GRADIENT }}>
                {user.name.split(" ").pop()?.[0] || "B"}
              </div>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.id}</div>
              </div>
              {user.verified && (
                <div className="ml-auto flex items-center gap-1 text-green-600 text-sm">
                  <ShieldCheck className="h-4 w-4" /> Đã xác minh
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 mt-4 text-[15px]">
              <div>📞 {user.phone}</div>
              <div>✉️ {user.email}</div>
              <div>👨‍⚕️ Chuyên khoa: {user.specialty}</div>
              <div>🏥 {user.workplace} – {user.dept}</div>
              <div>📍 {user.address}</div>
            </div>

            {/* <div className="mt-6">
              <SectionTitle title="Mã QR cá nhân" icon={<BadgeCheck className="h-5 w-5 text-red-600" />} />
              <div className="flex items-center gap-4">
                <QRCodeCanvas value={`GSK-${user.id}`} size={120} />
                <div className="text-sm text-gray-600">Dùng để check-in khi tham gia sự kiện của GSK.</div>
              </div>
            </div>

            <div className="mt-6">
              <SectionTitle title="Nhận thông tin" icon={<MailX className="h-5 w-5 text-red-600" />} />
              <div className="flex items-center justify-between">
                <div className="text-[15px]">Nhận tin nhắn/email từ GSK</div>
                <button
                  onClick={() => setSubscribed((s) => !s)}
                  className={`px-3 py-1 rounded-full text-sm ${subscribed ? "text-white" : "text-gray-700 border"}`}
                  style={{ background: subscribed ? GRADIENT : "transparent" }}
                >
                  {subscribed ? "Đang bật" : "Đã tắt"}
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                *Cú pháp từ chối nhận tin:* soạn <b>GSK TC</b> gửi <b>8xxx</b> (ví dụ). Hoặc tắt tại đây.
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RegisterFlow({ onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    specialty: "",
    dept: "",
    workplace: "",
    address: "",
    license: null,
  });

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const next = () => setStep((s) => s + 1);

  return (
    <div className="min-h-[80vh] pb-24">
      <div className="px-4 py-5 text-white" style={{ background: `linear-gradient(135deg, #ff4d4d, ${MAIN})` }}>
        <div className="text-xl font-semibold flex items-center gap-2">
          <FileCheck2 className="h-6 w-6" /> Đăng ký tài khoản
        </div>
        <div className="text-sm opacity-90 mt-1">Dành cho nhân viên y tế</div>
      </div>

      <div className="px-4 mt-4 space-y-5">
        {step === 1 && (
          <Card>
            <CardContent>
              <div className="text-base font-medium mb-3">Thông tin cơ bản</div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Họ và tên</Label>
                  <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="VD: BS. Nguyễn An" />
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <Input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="VD: 0909000000" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="email@benhvien.vn" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={next}>Tiếp tục</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent>
              <div className="text-base font-medium mb-3">Thông tin hồ sơ</div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Chuyên khoa</Label>
                  <Select
                    value={form.specialty}
                    onChange={(e) => onChange("specialty", e.target.value)}
                    options={[
                      { value: "", label: "Chọn chuyên khoa" },
                      { value: "noi", label: "Nội tổng quát" },
                      { value: "nhi", label: "Nhi" },
                      { value: "tmh", label: "Tai Mũi Họng" },
                      { value: "truyen", label: "Truyền nhiễm" },
                    ]}
                  />
                </div>
                <div>
                  <Label>Phòng ban/Khoa</Label>
                  <Input value={form.dept} onChange={(e) => onChange("dept", e.target.value)} placeholder="VD: Khoa Nội" />
                </div>
                <div>
                  <Label>Nơi công tác</Label>
                  <Input value={form.workplace} onChange={(e) => onChange("workplace", e.target.value)} placeholder="VD: BV Đa khoa A" />
                </div>
                <div>
                  <Label>Địa chỉ công tác</Label>
                  <Input value={form.address} onChange={(e) => onChange("address", e.target.value)} placeholder="Số nhà / đường / quận / tỉnh" />
                </div>
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <Button onClick={() => setStep(1)} className="opacity-90">Quay lại</Button>
                <Button onClick={next}>Tiếp tục</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardContent>
              <div className="text-base font-medium mb-3">Xác minh giấy phép hành nghề</div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Tải lên (PDF/JPG/PNG)</Label>
                  <label className="flex items-center gap-2 px-3 py-3 border rounded-xl cursor-pointer bg-white/80">
                    <Upload className="h-4 w-4" />
                    <span className="text-[15px]">Chọn tệp…</span>
                    <input type="file" className="hidden" onChange={(e) => onChange("license", e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div className="text-sm text-gray-600 bg-red-50 border border-red-100 rounded-xl p-3">
                  Sau khi gửi, hồ sơ sẽ được duyệt trong vòng 1–3 ngày làm việc trước khi kích hoạt tài khoản.
                </div>
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <Button onClick={() => setStep(2)} className="opacity-90">Quay lại</Button>
                <Button onClick={() => setStep(4)}>
                  Gửi hồ sơ <ChevronRight className="inline h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardContent className="text-center py-10">
              <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center text-white" style={{ background: GRADIENT }}>
                <BadgeCheck className="h-7 w-7" />
              </div>
              <div className="mt-3 text-base font-semibold">Hồ sơ đã gửi</div>
              <div className="text-sm text-gray-500 mt-1">Chúng tôi sẽ duyệt hồ sơ và kích hoạt tài khoản qua email/SMS.</div>
              <div className="mt-5">
                <Button onClick={onDone}>Về Trang chủ</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ==== Bottom Navigation with glass effect ====
function BottomNav({ active, setActive }) {
  const items = [
    { key: "home", label: "Trang chủ", icon: <Home /> },
    { key: "ykhoa", label: "Y Khoa", icon: <Bookmark /> },
    { key: "rxvx", label: "Nổi bật", icon: <Activity  /> },
    { key: "events", label: "Sự kiện", icon: <CalendarDays /> },
    { key: "profile", label: "Cá nhân", icon: <User2 /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white/90 backdrop-blur-lg" style={{ boxShadow: "0 -6px 20px rgba(0,0,0,0.06)" }}>
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setActive(it.key)}
            className={`flex flex-col items-center justify-center py-2 text-xs transition-all ${
              active === it.key ? "text-red-600 scale-105" : "text-gray-500"
            }`}
          >
            <div className="h-5 w-5">{it.icon}</div>
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ==== Root App with animated route transitions ====
export default function DemoApp() {
  const [screen, setScreen] = useState("home");
  const [showRegister, setShowRegister] = useState(false);

  const ScreenEl = (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${screen}-${showRegister ? "reg" : "main"}`}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        {!showRegister ? (
          <>
            {screen === "home" && <HomeTab />}
            {screen === "ykhoa" && <CategoryScreen catKey="ykhoa" />}
            {screen === "rxvx" && <CategoryScreen catKey="rxvx" />}
            {screen === "events" && <EventsScreen userId="NVYT-012345" />}
            {screen === "profile" && <ProfileScreen />}

            <BottomNav active={screen} setActive={setScreen} />

            {/* Floating action to Register (for demo) */}
            <button
              onClick={() => setShowRegister(true)}
              className="fixed right-4 bottom-20 rounded-full px-4 py-3 text-white shadow-lg flex items-center gap-2"
              style={{ background: GRADIENT }}
            >
              <LogIn className="h-4 w-4" /> Vào game nhận quà
            </button>
          </>
        ) : (
          <RegisterFlow onDone={() => setShowRegister(false)} />
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,system-ui]">
      {/* Status bar strip */}
      <div className="h-3" style={{ background: MAIN }} />
      {ScreenEl}
    </div>
  );
}
