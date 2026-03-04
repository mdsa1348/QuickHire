import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="absolute w-full top-0 py-6 px-6 md:px-32 flex items-center justify-between bg-transparent z-50">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="QuickHire" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-[#25324B] tracking-tight">QuickHire</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-[#515B6F] font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Find Jobs</Link>
          <Link href="#" className="hover:text-primary transition-colors">Browse Companies</Link>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <Link href="#" className="hidden md:block text-primary font-bold hover:opacity-80">Login</Link>
        <div className="w-[1px] h-6 bg-border hidden md:block"></div>
        <Link href="#" className="hidden md:block bg-primary text-white font-bold px-7 py-3 rounded-none transition-all hover:opacity-90">
          Sign Up
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-[#D6DDEB] text-[#25324B]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
