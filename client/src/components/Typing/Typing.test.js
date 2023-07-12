import { render, screen } from "@testing-library/react";
import Typing from "./Typing";

describe("TypingComponent", () => {
    it("should have 3 dots", () => {
        const {container} = render(<Typing />)
        expect(container.getElementsByClassName("typing__dot").length).toBe(3)
        screen.debug()
    })
})