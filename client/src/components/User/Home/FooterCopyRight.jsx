const FooterCopyright = () => {
  return (
    <footer className="bg-[#d9d9d9] text-black py-4">
      <div className="container mx-auto flex justify-between items-center px-4 text-sm">
        <p>Copyright @ 2024 Zad Alamil</p>
        <div className="space-x-4">
          <a href="/terms" className="hover:underline">Terms & Conditions</a>
          <span>|</span>
          <a href="/privacy-policy" className="hover:underline">Privacy Policy & Cookie</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterCopyright;
