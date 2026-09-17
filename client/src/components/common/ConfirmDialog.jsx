import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, loading, confirmLabel = "Delete" }) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </>
    }
  >
    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{message}</p>
  </Modal>
);

export default ConfirmDialog;
