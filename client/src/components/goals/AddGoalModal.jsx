import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { useCreateGoal, useUpdateGoal } from "../../hooks/useGoals";

const schema = z.object({
  name: z.string().min(1, "Give your goal a name").max(60),
  icon: z.string(),
  targetAmount: z.coerce.number().positive("Target must be greater than 0"),
  currentAmount: z.coerce.number().min(0).optional(),
  targetDate: z.string().min(1, "Choose a target date"),
});

const ICON_OPTIONS = [
  { value: "shield", label: "Emergency Fund" },
  { value: "plane", label: "Travel" },
  { value: "laptop", label: "Tech / Gadget" },
  { value: "car", label: "Vehicle" },
  { value: "education", label: "Education" },
  { value: "target", label: "General" },
];

const AddGoalModal = ({ open, onClose, goal }) => {
  const isEdit = Boolean(goal);
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const mutation = isEdit ? updateMutation : createMutation;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", icon: "target", targetAmount: "", currentAmount: 0, targetDate: "" },
  });

  useEffect(() => {
    if (open) {
      reset(
        goal
          ? {
              name: goal.name,
              icon: goal.icon,
              targetAmount: goal.targetAmount,
              currentAmount: goal.currentAmount,
              targetDate: goal.targetDate?.split("T")[0] || "",
            }
          : { name: "", icon: "target", targetAmount: "", currentAmount: 0, targetDate: "" }
      );
    }
  }, [open, goal, reset]);

  const onSubmit = async (values) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: goal._id, payload: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit goal" : "Create a goal"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Goal name" placeholder="e.g. Emergency Fund" error={errors.name?.message} {...register("name")} />
        <Select label="Icon" {...register("icon")}>
          {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Input label="Target amount" type="number" step="0.01" error={errors.targetAmount?.message} {...register("targetAmount")} />
        <Input label="Current amount" type="number" step="0.01" error={errors.currentAmount?.message} {...register("currentAmount")} />
        <Input label="Target date" type="date" error={errors.targetDate?.message} {...register("targetDate")} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>{isEdit ? "Save changes" : "Create goal"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGoalModal;
