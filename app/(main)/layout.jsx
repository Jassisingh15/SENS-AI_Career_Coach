import React from "react";

const MainLayout = async ({ children }) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Strategic Background Ambient Light Spots */}
      <div className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 -z-10 h-96 w-96 rounded-full bg-gradient-to-tr from-violet-600/10 via-pink-500/5 to-transparent blur-3xl" />

      <div className="container mx-auto mt-6 mb-20 px-4">{children}</div>
    </div>
  );
};

export default MainLayout;
