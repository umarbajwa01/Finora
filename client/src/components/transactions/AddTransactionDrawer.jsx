import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, ArrowDownCircle, ArrowUpCircle, Camera, ImagePlus, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  RECURRING_FREQUENCIES,
} from "../../constants/categories";
import { useCreateTransaction, useUpdateTransaction } from "../../hooks/useTransactions";
import { resizeImageFile } from "../../utils/imageResize";
import "./AddTransactionDrawer.css";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number({ invalid_type_error: "Enter an amount" }).positive("Amount must be greater than 0"),
  category: z.string().min(1, "Choose a category"),
  description: z.string().max(120, "Keep it under 120 characters").optional(),
  date: z.string().min(1, "Choose a date"),
  note: z.string().max(500).optional(),
  paymentMethod: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.string().optional(),
});

const todayISO = () => new Date().toISOString().split("T")[0];

const AddTransactionDrawer = ({ open, onClose, transaction, autoOpenCamera }) => {
  const isEdit = Boolean(transaction);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const mutation = isEdit ? updateMutation : createMutation;

  const fileInputRef = useRef(null);
  const [receiptPreview, setReceiptPreview] = useState("");
  const [receiptError, setReceiptError] = useState("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: todayISO(),
      note: "",
      paymentMethod: "card",
      isRecurring: false,
      recurringFrequency: "monthly",
    },
  });

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (open) {
      reset(
        transaction
          ? {
              type: transaction.type,
              amount: transaction.amount,
              category: transaction.category,
              description: transaction.description || "",
              date: transaction.date?.split("T")[0] || todayISO(),
              note: transaction.note || "",
              paymentMethod: transaction.paymentMethod || "card",
              isRecurring: transaction.isRecurring || false,
              recurringFrequency: transaction.recurring?.frequency || "monthly",
            }
          : {
              type: "expense",
              amount: "",
              category: "",
              description: "",
              date: todayISO(),
              note: "",
              paymentMethod: "card",
              isRecurring: false,
              recurringFrequency: "monthly",
            }
      );
      setReceiptPreview(transaction?.receiptUrl || "");
      setReceiptError("");
    }
  }, [open, transaction, reset]);

  // "Scan Receipt" from the dashboard opens this drawer and should jump
  // straight into the camera/file picker instead of making the user tap again.
  useEffect(() => {
    if (open && autoOpenCamera && !transaction) {
      const timer = setTimeout(() => fileInputRef.current?.click(), 250);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open, autoOpenCamera, transaction]);

  const handleReceiptChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setReceiptError("");
    setIsProcessingImage(true);
    try {
      const dataUrl = await resizeImageFile(file);
      setReceiptPreview(dataUrl);
    } catch (err) {
      setReceiptError(err.message || "Could not process that image.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const onSubmit = async (values) => {
    const payload = {
      type: values.type,
      amount: Number(values.amount),
      category: values.category,
      description: values.description,
      date: values.date,
      note: values.note,
      paymentMethod: values.paymentMethod,
      isRecurring: values.isRecurring,
      recurring: values.isRecurring ? { frequency: values.recurringFrequency } : null,
      receiptUrl: receiptPreview || "",
    };

    if (isEdit) {
      await updateMutation.mutateAsync({ id: transaction._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setTimeout(onClose, 900);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="tx-drawer__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="tx-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            <div className="tx-drawer__header">
              <h3 className="font-display">{isEdit ? "Edit transaction" : "Add transaction"}</h3>
              <button onClick={onClose} aria-label="Close"><X size={20} /></button>
            </div>

            {mutation.isSuccess && isSubmitSuccessful ? (
              <motion.div
                className="tx-drawer__success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="tx-drawer__success-icon"><Check size={28} /></div>
                <p>{isEdit ? "Transaction updated" : "Transaction added"}</p>
              </motion.div>
            ) : (
              <form className="tx-drawer__form" onSubmit={handleSubmit(onSubmit)}>
                <div className="tx-type-toggle">
                  <button
                    type="button"
                    className={`tx-type-toggle__btn${type === "expense" ? " is-active is-expense" : ""}`}
                    onClick={() => { setValue("type", "expense"); setValue("category", ""); }}
                  >
                    <ArrowDownCircle size={16} /> Expense
                  </button>
                  <button
                    type="button"
                    className={`tx-type-toggle__btn${type === "income" ? " is-active is-income" : ""}`}
                    onClick={() => { setValue("type", "income"); setValue("category", ""); }}
                  >
                    <ArrowUpCircle size={16} /> Income
                  </button>
                </div>

                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={errors.amount?.message}
                  {...register("amount")}
                />

                <Select label="Category" error={errors.category?.message} {...register("category")}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </Select>

                <Input
                  label="Description"
                  placeholder="e.g. Whole Foods grocery run"
                  error={errors.description?.message}
                  {...register("description")}
                />

                <Input
                  label="Date"
                  type="date"
                  error={errors.date?.message}
                  {...register("date")}
                />

                <div className="receipt-field">
                  <span className="field__label">Receipt (optional)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={handleReceiptChange}
                  />

                  {receiptPreview ? (
                    <div className="receipt-field__preview">
                      <img src={receiptPreview} alt="Receipt preview" />
                      <button
                        type="button"
                        className="receipt-field__remove"
                        onClick={() => setReceiptPreview("")}
                        aria-label="Remove receipt"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="receipt-field__button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingImage}
                    >
                      {isProcessingImage ? (
                        <Loader2 size={16} className="btn__spinner" />
                      ) : (
                        <Camera size={16} />
                      )}
                      <span>{isProcessingImage ? "Processing..." : "Scan or attach receipt"}</span>
                      <ImagePlus size={15} className="receipt-field__hint-icon" />
                    </button>
                  )}
                  {receiptError && <span className="field__error">{receiptError}</span>}
                </div>

                <Select label="Payment method" {...register("paymentMethod")}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </Select>

                <Input
                  label="Note (optional)"
                  placeholder="Any additional details"
                  {...register("note")}
                />

                <Controller
                  control={control}
                  name="isRecurring"
                  render={({ field }) => (
                    <label className="tx-recurring-toggle">
                      <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                      <span>Make this a recurring transaction</span>
                    </label>
                  )}
                />

                {isRecurring && (
                  <Select label="Frequency" {...register("recurringFrequency")}>
                    {RECURRING_FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </Select>
                )}

                {mutation.isError && (
                  <p className="tx-drawer__error">
                    {mutation.error?.response?.data?.message || "Something went wrong. Please try again."}
                  </p>
                )}

                <div className="tx-drawer__actions">
                  <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                  <Button type="submit" variant="primary" loading={mutation.isPending}>
                    {isEdit ? "Save changes" : "Add transaction"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddTransactionDrawer;
