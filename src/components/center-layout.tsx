const CenterLayout = ({ children }: { children: React.ReactNode }) => {
 return (
  <>
   <div className="mx-auto flex flex-col h-screen w-full items-center justify-center">
    {children}
   </div>
  </>
 );
};

export default CenterLayout;
