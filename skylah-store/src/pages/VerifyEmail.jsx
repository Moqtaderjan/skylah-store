import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { CheckCircle2, MailCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { auth } from '../lib/firebase';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying your email...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  const title = useMemo(() => {
    if (isSuccess) return 'Email Verified';
    if (!oobCode || mode !== 'verifyEmail') return 'Verification Link';
    return 'Verifying Email';
  }, [isSuccess, mode, oobCode]);

  useEffect(() => {
    const verify = async () => {
      if (!oobCode || mode !== 'verifyEmail') {
        setIsLoading(false);
        setStatus('This verification link is missing or invalid. Please request a new verification email from your account page.');
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setIsSuccess(true);
        setStatus('Your email has been verified successfully. You can now return to your account and sign in.');
      } catch (error) {
        setStatus(error.message || 'We could not verify this email link. It may be expired or already used.');
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [mode, oobCode]);

  return (
    <section className="container section narrow-section verify-page">
      <div className="verify-shell">
        <div className="verify-badge">
          <Sparkles size={16} />
          Skylah Secure Verification
        </div>

        <div className="verify-card">
          <div className="verify-icon-wrap">
            {isSuccess ? <CheckCircle2 size={56} /> : <ShieldCheck size={56} />}
          </div>
          <h2>{title}</h2>
          <p>{status}</p>

          {isLoading ? (
            <div className="verify-loading">
              <MailCheck size={18} />
              <span>Confirming link...</span>
            </div>
          ) : isSuccess ? (
            <div className="verify-actions">
              <Link to="/account" className="btn btn-primary">Go to Account</Link>
              <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>
          ) : (
            <div className="verify-actions">
              <Link to="/account" className="btn btn-primary">Return to Account</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
