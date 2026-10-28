import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const PHONE_LENGTH = 11;
const PHONE_REGEX = /^01\d{9}$/;

const getPhoneError = (phone) => {
  if (!phone) return 'Mobile number is required.';
  if (phone.length !== PHONE_LENGTH)
    return `Mobile number must be exactly ${PHONE_LENGTH} digits.`;
  if (!phone.startsWith('01')) return 'Mobile number must start with 01.';
  if (!PHONE_REGEX.test(phone)) return 'Enter a valid mobile number.';
  return '';
};

const AddressForm = forwardRef(({ user, onAddressChange }, ref) => {
  const phoneInputRef = useRef(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Send initial data on load (after the initial render and potential user prop update)
  useEffect(() => {
    onAddressChange(formData);
  }, [formData, onAddressChange]);

  const phoneError = getPhoneError(formData.phone);
  const showPhoneError =
    Boolean(phoneError) && (phoneTouched || attemptedSubmit);
  const showPhoneSuccess =
    !phoneError && phoneTouched && Boolean(formData.phone);

  useImperativeHandle(
    ref,
    () => ({
      validate() {
        setAttemptedSubmit(true);
        if (phoneError) {
          phoneInputRef.current?.focus();
          phoneInputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          return false;
        }
        return true;
      },
    }),
    [phoneError],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Only allow digits in the phone field
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, PHONE_LENGTH);
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: newValue };
      return newData;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
        Address
      </h1>

      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">
          Full Name <span className="text-red-600">*</span>
        </h2>
        <input
          name="fullName"
          type="text"
          placeholder="ex Mr./Mrs/Miss"
          className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
          required
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="font-medium">
          Mobile Number <span className="text-red-600">*</span>
        </label>

        <div className="relative">
          <input
            id="phone"
            ref={phoneInputRef}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="ex 01234567890"
            maxLength={PHONE_LENGTH}
            className={`py-2 pl-4 pr-10 w-full border rounded-md focus:outline-none focus:ring-1 transition placeholder:text-sm ${
              showPhoneError
                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500'
                : showPhoneSuccess
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:primaryRingColor'
            }`}
            required
            aria-invalid={showPhoneError}
            aria-describedby={
              showPhoneError ? 'phone-error' : 'phone-helper'
            }
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => setPhoneTouched(true)}
          />
          {showPhoneError && (
            <AlertCircle
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-red-500"
              aria-hidden="true"
            />
          )}
          {showPhoneSuccess && (
            <CheckCircle2
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-green-500"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="flex items-start justify-between gap-2 text-xs">
          <div aria-live="polite" className="min-h-4">
            {showPhoneError ? (
              <p
                id="phone-error"
                className="flex items-center gap-1 font-medium text-red-600"
              >
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                {phoneError}
              </p>
            ) : showPhoneSuccess ? (
              <p className="flex items-center gap-1 font-medium text-green-600">
                <CheckCircle2
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
                Looks good
              </p>
            ) : (
              <p id="phone-helper" className="text-gray-500">
                11 digits, starting with 01 (e.g. 01712345678).
              </p>
            )}
          </div>
          <span
            className={`shrink-0 tabular-nums ${
              showPhoneError ? 'font-medium text-red-600' : 'text-gray-400'
            }`}
          >
            {formData.phone.length}/{PHONE_LENGTH}
          </span>
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-2">
        <h2>
          Address <span className="text-red-600">*</span>
        </h2>
        <input
          name="address"
          type="text"
          placeholder="ex House no. / Building / Street / Area"
          className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
          required
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <h2>
          Email <span className="text-sm">(Optional)</span>
        </h2>
        <input
          name="email"
          type="email"
          placeholder="ex example@email.com"
          className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});

AddressForm.displayName = 'AddressForm';

export default AddressForm;
