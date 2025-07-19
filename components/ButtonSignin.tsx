/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signInWithEmail, signUpWithEmail, signOut } from "@/libs/supabaseAuth";

// A simple button to sign in with Supabase authentication.
// It shows a login modal when clicked, and displays user info when logged in.
const ButtonSignin = ({
  text = "登录",
  extraStyle,
}: {
  text?: string;
  extraStyle?: string;
}) => {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const currentSession = await getSession();
        console.log("Current session:", currentSession);
        setSession(currentSession);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    console.log("Attempting to sign in with:", email);

    try {
      if (isSignUp) {
        const result = await signUpWithEmail(email, password);
        console.log("Sign up result:", result);
        setError("注册成功！请检查您的邮箱以验证账户。");
      } else {
        const data = await signInWithEmail(email, password);
        console.log("Sign in result:", data);
        
        if (data.session) {
          setSession(data.session);
          setShowModal(false);
          setEmail("");
          setPassword("");
          
          // 强制刷新页面以确保状态更新
          window.location.reload();
        } else {
          throw new Error("登录成功但未获取到会话信息");
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || "登录失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <button className={`btn ${extraStyle ? extraStyle : ""}`} disabled>
        <span className="loading loading-spinner loading-sm"></span>
      </button>
    );
  }

  if (session) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className={`btn ${extraStyle ? extraStyle : ""}`}>
          <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center rounded-full shrink-0 text-white text-sm">
            {session.user?.email?.charAt(0).toUpperCase()}
          </span>
          {session.user?.email}
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><Link href="/dashboard">我的账户</Link></li>
          <li><Link href="/my-stories">我的故事</Link></li>
          <li><button onClick={handleSignOut}>退出登录</button></li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <button
        className={`btn ${extraStyle ? extraStyle : ""}`}
        onClick={() => setShowModal(true)}
      >
        {text}
      </button>

      {/* Login Modal */}
      {showModal && (
        <div className="modal block">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {isSignUp ? "注册账户" : "登录账户"}
            </h3>
            
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">邮箱</span>
                </label>
                <input
                  type="email"
                  placeholder="请输入邮箱"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">密码</span>
                </label>
                <input
                  type="password"
                  placeholder="请输入密码"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setEmail("");
                    setPassword("");
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    isSignUp ? "注册" : "登录"
                  )}
                </button>
              </div>
            </form>

            <div className="divider">或</div>
            
            <button
              type="button"
              className="btn btn-ghost w-full"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp ? "已有账户？点击登录" : "没有账户？点击注册"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonSignin;


