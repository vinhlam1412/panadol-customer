import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift } from "lucide-react";

const MAIN_BG = "linear-gradient(to bottom, #ff4d4d, #cc0000)";

const Card = ({ children }) => (
  <div className="rounded-2xl shadow-md p-4 bg-white/90 backdrop-blur-md">{children}</div>
);
const Input = (props) => (
  <input {...props} className="w-full border rounded-xl px-3 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/85 backdrop-blur-sm" />
);
const Label = ({ children }) => <label className="block text-sm text-gray-700 mb-1">{children}</label>;
const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full mt-3 px-4 py-3 rounded-2xl text-white font-medium shadow transition-all hover:scale-105 hover:brightness-110"
    style={{ background: MAIN_BG }}
  >
    {children}
  </button>
);

function LoginScreen({ onNext }) {
  const [phone, setPhone] = useState("");
  return (
    <div className="min-h-screen flex flex-col justify-center px-4" style={{ background: MAIN_BG }}>
      <Card>
        <h1 className="text-xl font-bold text-red-700 mb-3 text-center">Đăng nhập</h1>
        <Label>Số điện thoại</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="VD: 0909000000" />
        <Button onClick={onNext}>Tiếp tục</Button>
      </Card>
    </div>
  );
}

function PersonalInfoScreen({ onNext }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="min-h-screen flex flex-col justify-center px-4" style={{ background: MAIN_BG }}>
      <Card>
        <h1 className="text-xl font-bold text-red-700 mb-3 text-center">Thông tin cá nhân</h1>
        <Label>Họ và tên</Label>
        <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="VD: Nguyễn Văn A" />
        <Label className="mt-3">Số điện thoại</Label>
        <Input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="VD: 0909000000" />
        <Button onClick={onNext}>Tiếp tục</Button>
      </Card>
    </div>
  );
}

function PharmacyInfoScreen({ onNext }) {
  const [form, setForm] = useState({ pharmacy: "", city: "", ward: "", street: "" });
  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="min-h-screen flex flex-col justify-center px-4" style={{ background: MAIN_BG }}>
      <Card>
        <h1 className="text-xl font-bold text-red-700 mb-3 text-center">Thông tin nhà thuốc</h1>
        <Label>Nhà thuốc</Label>
        <Input value={form.pharmacy} onChange={(e) => onChange("pharmacy", e.target.value)} placeholder="VD: Nhà thuốc Panadol" />
        <Label className="mt-3">Thành phố</Label>
        <Input value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder="VD: TP.HCM" />
        <Label className="mt-3">Phường</Label>
        <Input value={form.ward} onChange={(e) => onChange("ward", e.target.value)} placeholder="VD: P.1" />
        <Label className="mt-3">Đường</Label>
        <Input value={form.street} onChange={(e) => onChange("street", e.target.value)} placeholder="VD: Nguyễn Trãi" />
        <Button onClick={onNext}>Gửi thông tin</Button>
      </Card>
    </div>
  );
}

function ThankYouScreen() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center" style={{ background: MAIN_BG }}>
      <Card>
        <Gift className="h-16 w-16 text-red-600 mb-4 mx-auto" />
        <h1 className="text-xl font-bold text-red-700">Cảm ơn bạn!</h1>
        <p className="text-gray-700 mt-2 max-w-xs mx-auto">Thông tin đã được ghi nhận. Vui lòng liên hệ nhà thuốc để nhận sản phẩm.</p>
      </Card>
    </div>
  );
}

export default function CustomerApp() {
  const [step, setStep] = useState("login");
  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
        {step === "login" && <LoginScreen onNext={() => setStep("personal")} />}
        {step === "personal" && <PersonalInfoScreen onNext={() => setStep("pharmacy")} />}
        {step === "pharmacy" && <PharmacyInfoScreen onNext={() => setStep("thanks")} />}
        {step === "thanks" && <ThankYouScreen />}
      </motion.div>
    </AnimatePresence>
  );
}
