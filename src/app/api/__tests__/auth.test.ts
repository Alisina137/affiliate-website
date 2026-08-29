// src/app/api/__tests__/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { testDb, cleanDatabase, closeTestDb } from "../../../../test/db"

describe("Authentication", () => {
  beforeAll(async () => {
    await cleanDatabase()
  })

  afterAll(async () => {
    await closeTestDb()
  })

  it("should create a user", async () => {
    const user = await testDb.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        role: "USER",
      },
    })

    expect(user).toBeDefined()
    expect(user.email).toBe("test@example.com")
    expect(user.role).toBe("USER")
  })

  it("should find user by email", async () => {
    const user = await testDb.user.findUnique({
      where: { email: "test@example.com" },
    })

    expect(user).toBeDefined()
    expect(user?.email).toBe("test@example.com")
  })

  it("should create admin user", async () => {
    const admin = await testDb.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        password: "hashed_password",
        role: "ADMIN",
      },
    })

    expect(admin).toBeDefined()
    expect(admin.role).toBe("ADMIN")
  })

  it("should find admin user", async () => {
    const admin = await testDb.user.findFirst({
      where: { role: "ADMIN" },
    })

    expect(admin).toBeDefined()
    expect(admin?.role).toBe("ADMIN")
  })
})
