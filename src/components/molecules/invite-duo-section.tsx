import React, { FormEventHandler, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { PROFILE_MESSAGES } from '@/constants/profile';
import { createDuoInviteMessage } from '@/utils/profileHelpers';
import { logError } from '@/utils/logger';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InviteDuoSectionComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError(PROFILE_MESSAGES.INVITE_DUO.REQUIRED);
      toast.error(PROFILE_MESSAGES.INVITE_DUO.REQUIRED);
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError(PROFILE_MESSAGES.INVITE_DUO.INVALID_EMAIL);
      toast.error(PROFILE_MESSAGES.INVITE_DUO.INVALID_EMAIL);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const subject = PROFILE_MESSAGES.INVITE_DUO.SUBJECT;
    const body = createDuoInviteMessage();
    const mailtoUrl = `mailto:${encodeURIComponent(trimmedEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      window.open(mailtoUrl, '_blank');
      toast.success(PROFILE_MESSAGES.INVITE_DUO.SUCCESS);
      setEmail('');
    } catch (error_) {
      logError('Failed to launch invite email', error_, {
        component: 'InviteDuoSection',
        action: 'handleSubmit',
        additionalData: { email: trimmedEmail },
      });
      toast.error(PROFILE_MESSAGES.INVITE_DUO.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="invite-duo-section"
    >
      <div className="flex items-start gap-4 mb-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pairup-cyan/20 text-pairup-darkBlue">
          <UserPlus className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-pairup-darkBlue mb-1">
            {PROFILE_MESSAGES.INVITE_DUO.TITLE}
          </h3>
          <p className="text-sm text-pairup-darkBlue/70">
            {PROFILE_MESSAGES.INVITE_DUO.DESCRIPTION}
          </p>
        </div>
      </div>

      <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
        Invite by email
        <input
          type="email"
          value={email}
          onChange={event => {
            setEmail(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          placeholder={PROFILE_MESSAGES.INVITE_DUO.EMAIL_PLACEHOLDER}
          disabled={isSubmitting}
          aria-invalid={error ? 'true' : 'false'}
          className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="invite-duo-email"
          autoComplete="email"
        />
      </label>

      {error ? (
        <p
          className="mt-2 text-sm text-red-600"
          data-testid="invite-duo-error"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-lg border border-pairup-darkBlue bg-transparent px-5 py-2 text-sm font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-darkBlue hover:text-white focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="invite-duo-submit"
        >
          {isSubmitting ? 'Sending…' : PROFILE_MESSAGES.INVITE_DUO.CTA}
        </button>
      </div>
    </form>
  );
};

const InviteDuoSection = React.memo(InviteDuoSectionComponent);
InviteDuoSection.displayName = 'InviteDuoSection';

export default InviteDuoSection;
