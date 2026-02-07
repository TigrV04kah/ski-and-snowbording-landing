import assert from "node:assert/strict";
import { filterInstructors, filterServices } from "@/lib/filters";
import { leadSchema } from "@/lib/lead-schema";
import { getMockInstructors, getMockServices } from "@/lib/mock-data";

function testLeadSchema() {
  const valid = leadSchema.safeParse({
    name: "Alex",
    contact: "+995555123456",
    inquiryType: "instructor",
    locale: "ru",
    consent: true,
    hp_field: "",
  });

  assert.equal(valid.success, true, "valid lead payload should pass");

  const invalidConsent = leadSchema.safeParse({
    name: "Alex",
    contact: "+995555123456",
    inquiryType: "instructor",
    locale: "ru",
    consent: false,
    hp_field: "",
  });

  assert.equal(invalidConsent.success, false, "payload without consent should fail");

  const spamPayload = leadSchema.safeParse({
    name: "Alex",
    contact: "+995555123456",
    inquiryType: "service",
    locale: "en",
    consent: true,
    hp_field: "bot",
  });

  assert.equal(spamPayload.success, false, "payload with honeypot value should fail");
}

function testFilters() {
  const instructors = getMockInstructors("ru");
  const services = getMockServices("ru");

  const snowboardBeginners = filterInstructors(instructors, {
    discipline: "snowboard",
    level: "beginner",
  });

  assert.ok(snowboardBeginners.length > 0, "snowboard beginner filter should return data");
  assert.ok(
    snowboardBeginners.every((item) => item.discipline === "snowboard" && item.level.includes("beginner")),
    "snowboard beginner filter should match all results",
  );

  const transferServices = filterServices(services, { serviceType: "transfer" });
  assert.equal(transferServices.length, 1, "service type filter should return one transfer item");
}

function run() {
  testLeadSchema();
  testFilters();
  console.log("All tests passed");
}

run();
