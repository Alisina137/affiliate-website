import { describe, expect, it } from "vitest"
import { isPrivateAddress } from "./safe-fetch"

describe("optimizer safe URL fetch address policy", () => {
  it("blocks common private and loopback IPv4 ranges", () => {
    expect(isPrivateAddress("127.0.0.1")).toBe(true)
    expect(isPrivateAddress("10.0.0.1")).toBe(true)
    expect(isPrivateAddress("172.16.0.1")).toBe(true)
    expect(isPrivateAddress("192.168.1.1")).toBe(true)
    expect(isPrivateAddress("169.254.169.254")).toBe(true)
  })

  it("blocks local and unique-local IPv6 ranges", () => {
    expect(isPrivateAddress("::1")).toBe(true)
    expect(isPrivateAddress("fc00::1")).toBe(true)
    expect(isPrivateAddress("fe80::1")).toBe(true)
  })

  it("allows representative public addresses", () => {
    expect(isPrivateAddress("1.1.1.1")).toBe(false)
    expect(isPrivateAddress("8.8.8.8")).toBe(false)
    expect(isPrivateAddress("2606:4700:4700::1111")).toBe(false)
  })
})
