import style from "./passwordInput.module.scss";
import * as Yup from "yup";

export interface ObjectType {
    id: string;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
    minlength?: number;
}

export interface RenderInputProps {
    item: ObjectType;
    onInputChange: (e: React.ChangeEvent) => void;
    width?: string;
    value: string;
}
// const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
export const yupRegisterPasswordValidation = Yup.string()
    .required("Required")
    .min(3, "Password too short")
    .max(24, "Password too long");
//   .matches(
//     passwordRegExp,
//     'Your password must contain small and capital letters, special character and number.',
//   );

export const PasswordInput = ({ item, onInputChange, value, width }: RenderInputProps) => {
    return (
        <div className={style.inputContainer} key={item.id} style={{ width: `${width}` }}>
            <label htmlFor={item.id} className={style.label}>
                {item.label}
            </label>
            <input
                type={item.type || "text"}
                placeholder={item.placeholder}
                id={item.id}
                className={style.input}
                onChange={onInputChange}
                value={value}
                data-testid="passwordInput"
                // required={item.required}
                // minLength={item.minlength}
            />
        </div>
    );
};
