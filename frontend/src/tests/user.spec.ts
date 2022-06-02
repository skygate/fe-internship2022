import { store } from "store/store";
import { setUser } from "store/user";

const mockPostUser = jest.fn();

jest.mock("store/helpers", () => ({
    postUser: () => mockPostUser(),
}));

const initialState = {
    status: "",
    userID: "",
};

const getState = () => store.getState().user;

describe("store/user.ts", () => {
    it("should set initial state", () => {
        expect(getState()).toStrictEqual(initialState);
    });

    it("should set the userID if repsonse is successful", async () => {
        mockPostUser.mockImplementationOnce(() => Promise.resolve("fakeID"));
        await store.dispatch(setUser());
        expect(getState()).toStrictEqual({
            status: "success",
            userID: "fakeID",
        });
    });

    it("should no set the userID if repsonse failed", async () => {
        mockPostUser.mockImplementationOnce(() => Promise.reject("some error"));
        await store.dispatch(setUser());
        expect(getState()).toStrictEqual({
            status: "failed",
            userID: "",
        });
    });

    it("should set the correct status when request is pending", async () => {
        mockPostUser.mockImplementationOnce(() => Promise.resolve("fakeID"));
        store.dispatch(setUser());
        expect(getState()).toStrictEqual({
            status: "loading",
            userID: "",
        });
    });
});
