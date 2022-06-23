import style from "./createSingleCollectibleForm.module.scss";
import { WideTextInputs, RowTextInputs, UploadFile, AddAuctionForm } from "components";
import { InputFileChange } from "interfaces/file";

interface FormProps {
    onInputChange: (e: React.ChangeEvent) => void;
    onToggleChange: (e: React.ChangeEvent) => void;
    onImgSrcChange: (arg: InputFileChange) => void;
    onFormSubmit: (e: React.FormEvent) => void;
}

export const CreateSingleCollectibleForm = ({
    onInputChange,
    onToggleChange,
    onImgSrcChange,
    onFormSubmit,
}: FormProps) => {
    return (
        <form className={style.form} onSubmit={onFormSubmit}>
            <UploadFile onImgSrcChange={onImgSrcChange} />
            <p className={style.formHeader}>Item Details</p>
            <WideTextInputs onInputChange={onInputChange} />
            <RowTextInputs onInputChange={onInputChange} />
            <AddAuctionForm onInputChange={onInputChange} onToggleChange={onToggleChange} />
            <button type="submit" className={style.submitButton}>
                Create item
            </button>
        </form>
    );
};
