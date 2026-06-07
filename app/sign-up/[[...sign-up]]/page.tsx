import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-black z-0" />
      <div className="relative z-10 p-8 glass rounded-3xl box-glow">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white",
              card: "bg-transparent shadow-none",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "border-white/10 hover:bg-white/5 text-white",
              socialButtonsBlockButtonText: "text-white",
              dividerLine: "bg-white/10",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-black/50 border-white/10 text-white",
              footerActionText: "text-gray-400",
              footerActionLink: "text-red-500 hover:text-red-400"
            }
          }}
        />
      </div>
    </div>
  );
}
