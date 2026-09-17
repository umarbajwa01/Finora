import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { useContributeToGoal } from "../../hooks/useGoals";

const schema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
});

const ContributeModal = ({ open, onClose, goal }) => {
  const mutation = useContributeToGoal();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: "" },
  });

  const onSubmit = async (values) => {
    await mutation.mutateAsync({ id: goal._id, amount: Number(values.amount) });
    reset();
    onClose();
  };

  if (!goal) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Contribute to ${goal.name}`} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Contribution amount" type="number" step="0.01" placeholder="0.00" error={errors.amount?.message} {...register("amount")} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Add contribution</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContributeModal;
