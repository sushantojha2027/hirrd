import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const {user} = useUser();
  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search])
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({})
    }
  };

  return (
    <>
      <header className="w-full border-b border-gray-800 bg-transparent">
        {/* ⬇️ Full-width layout with slight side padding */}
        <nav className="w-full px-4 sm:px-8 lg:px-12 py-3 flex justify-between items-center">
          {/* Left: Logo */}
          <Link to="/">
            <img
              src="/logojobportal.png"
              alt="Logo"
              className="h-10 sm:h-14 object-contain"
            />
          </Link>

          {/* Right: Buttons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <SignedOut>
              <Button
                variant="outline"
                onClick={() => setShowSignIn(true)}
                className="rounded-full px-5 py-2 text-sm sm:text-base"
              >
                Login
              </Button>
            </SignedOut>

            <SignedIn>
              {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button
                  variant="destructive"
                  className="rounded-full flex items-center px-5 py-2 text-sm sm:text-base"
                >
                  <PenBox size={18} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
              )}
              <UserButton 
              appearance={
                {
                  elements:{
                    avatarBox: "w-10 h-10",
                  }
                }
              } >
                <UserButton.MenuItems>
                  <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15}/>}
                  href="/my-jobs"/>
                    <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15}/>}
                  href="/saved-jobs"/>
                  
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>
        </nav>
      </header>

      {/* Sign-In Overlay */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
            appearance={{
              elements: { card: "shadow-lg rounded-xl" },
            }}
          />
        </div>
      )}
    </>
  );
};

export default Header;