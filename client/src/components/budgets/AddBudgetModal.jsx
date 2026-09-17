import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { EXPENSE_CATEGORIES } from "../../constants/categories";
import { useCreateBudget, useUpdateBudget } from "../../hooks/useBudgets";

const schema = z.object({
  category: z.string().min(1, "Choose a category"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  period: z.enum(["weekly", "monthly", "yearly"]),
});

const AddBudgetModal = ({ open, onClose, budget }) => {
  const isEdit = Boolean(budget);
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const mutation = isEdit ? updateMutation : createMutation;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: "", amount: "", period: "monthly" },
  });

  useEffect(() => {
    if (open) {
      reset(
        budget
          ? { category: budget.category, amount: budget.amount, period: budget.period }
          : { category: "", amount: "", period: "monthly" }
      );
    }
  }, [open, budget, reset]);

  const onSubmit = async (values) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: budget._id, payload: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit budget" : "Create budget"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Select label="Category" error={errors.category?.message} {...register("category")}>
          <option value="">Select a category</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
        <Input label="Budget amount" type="number" step="0.01" placeholder="0.00" error={errors.amount?.message} {...register("amount")} />
        <Select label="Period" {...register("period")}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>{isEdit ? "Save changes" : "Create budget"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBudgetModal;
