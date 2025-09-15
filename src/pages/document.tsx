import React from "react";
import { Box, Page, Spinner } from "zmp-ui";
import MainHeader from "../components/main-header";
import { useNavigate } from "react-router-dom";
import { useState } from "react"

export default function ProgramDocumentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 


if (loading) {
  return (
    <Page className="page text-center !p-0 !m-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box
        flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner visible logo={undefined} />
      </Box>
    </Page>
  );
}
  return (
   <Page>
    <MainHeader title="Tài liệu chương trình" />

    <div className="flex flex-col min-h-screen w-full bg-slate-50  justify-center items-start">
    
    <div className="w-full max-w-md p-6">
        {/* Header title */}
        <h3 className="text-sm font-semibold text-emerald-600 mb-3">Tài liệu về chương trình</h3>

        {/* Card */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-4">
          {/* Date pill */}
          <div className="inline-block rounded-md bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            12/12/2025
          </div>

          {/* Title */}
          <h4 className="mt-3 text-base font-semibold text-slate-800">What is Lorem Ipsum?</h4>

          {/* Content */}
          <div className="mt-2 space-y-4 text-sm leading-6 text-slate-600">
            <div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
                like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Where does it come from?</p>
              <p>
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
                of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock,
                a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words,
                consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature,
                discovered the undoubtable source. Lorem Ipsum
              </p>
            </div>
          </div>
        </div>
    </div>   

    <div className="flex items-end justify-end w-fulltext-right cursor-pointer p-4 bg-slate-50  ">
        <button onClick={() => { navigate("/")
        }} className={'text-white font-bold bg-primary rounded-2xl px-4 py-2'}>Trở về</button>
    </div> 
    </div> 
   </Page>
  );
}
