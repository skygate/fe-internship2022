import { fireEvent, render, screen } from "@testing-library/react";
import { PasswordInput, RenderInputProps } from "components/passwordInput/PasswordInput";
import { SyntheticEvent } from "react";

const inputChangeHander = jest.fn();
const value = "";

const passwordInputProps: RenderInputProps = {
    item: {
        id: "passwordInput",
        label: "Item Label",
        placeholder: "Password Input",
    },
    value: value,
    onInputChange: inputChangeHander,
};

const passwordInputTestId = "passwordInput";

describe("components/passwordInput", () => {
    it("renders the input", () => {
        const { container } = render(
            <PasswordInput
                item={passwordInputProps.item}
                value={passwordInputProps.value}
                onInputChange={passwordInputProps.onInputChange}
            />
        );
        expect(container).toMatchSnapshot();
    });

    it("updates model after change", () => {
        inputChangeHander.mockImplementationOnce((evt: SyntheticEvent) => {
            expect((evt.target as HTMLInputElement).value).toBe("new value");
        });

        render(
            <PasswordInput
                item={passwordInputProps.item}
                value={passwordInputProps.value}
                onInputChange={passwordInputProps.onInputChange}
            />
        );
        fireEvent.change(screen.getByTestId(passwordInputTestId), {
            target: { value: "new value" },
        });
    });

    it("sets the width inline styles when passed", () => {
        const { container } = render(
            <PasswordInput
                item={passwordInputProps.item}
                value={passwordInputProps.value}
                onInputChange={passwordInputProps.onInputChange}
                width={"100px"}
            />
        );
        expect(container).toMatchSnapshot();
    });
});
