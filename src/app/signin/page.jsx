"use client";
import FormBanner from "@/components/supplierform/FormBanner";
import SigninForm from "../../components/auth/SigninForm";

export default function SigninPage() {
    return (

        <>
            <FormBanner />
           <div className=" suppliervalidation   w-full">
             <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-lg absolute left-1/2 top-30 -translate-x-1/2">
                    <h2 className="text-3xl font-bold text-center text-gray-900">
                        Welcome Back Seller
                    </h2>
                    <p className="text-center text-gray-600 mt-2 mb-6 text-lg">Sign In</p>

                    <SigninForm />

                    <p className="text-center text-sm text-gray-700 mt-6">
                        New to A2Z Gulf?{" "}
                        <a href="/supplierform" className="text-blue-500 font-medium hover:underline">
                            Create an account
                        </a>
                    </p>
                </div>
            </div>
           </div>
        </>

    );
}
