// src/pages/LoginPage.tsx


import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return (
        <>


            <main className="py-12 bg-gray-100 min-h-screen flex justify-center items-center">
                <div className="container mx-auto px-4 max-w-md">
                    <LoginForm />
                </div>
            </main>


        </>
    );
}
