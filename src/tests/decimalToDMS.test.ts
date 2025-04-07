import { decimalToDMS } from "../components/Utils";

test("converts positive latitude correctly", () => {
    expect(decimalToDMS(51.505, true)).toBe(`51° 30' 18.0" N`);
});

test("converts negative latitude correctly", () => {
    expect(decimalToDMS(-51.505, true)).toBe(`51° 30' 18.0" S`);
});

test("converts positive longitude correctly", () => {
    expect(decimalToDMS(0.1278, false)).toBe(`0° 7' 40.1" E`);
});

test("converts negative longitude correctly", () => {
    expect(decimalToDMS(-0.1278, false)).toBe(`0° 7' 40.1" W`);
});

test("handles zero correctly", () => {
    expect(decimalToDMS(0, true)).toBe(`0° 0' 0.0" N`);
    expect(decimalToDMS(0, false)).toBe(`0° 0' 0.0" E`);
});
