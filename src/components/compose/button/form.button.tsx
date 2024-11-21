import './form.button.css';

interface IFormButton {
  onClick: () => void;
  color: string;
  label: string;
  icon: string;
}

export const FormButton = ({ onClick, color, label, icon }: IFormButton) => {
  return (
    <button class={`${color} vx-form-actions-button`} onClick={onClick}>
      <span className={`vox-icon vx-icon-${icon}`} />
      <h6>{label}</h6>
    </button>
  );
};
