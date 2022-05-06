/// <reference types="cypress" />

const testuserData = require("../../fixtures/testuser.json");

describe("Login Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  beforeEach(() => {
    cy.get("body").then((body) => {
      if (body.find("[data-test=logout-link]").length > 0) {
        cy.get("[data-test=logout-link]").click();
      }
    });
  });

  it("should login with a valid username and password", () => {
    cy.loginWithUI(testuserData.username, testuserData.password);

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=user-greet]")
      .should("be.visible")
      .and("contain", `Hi ${testuserData.username}`)
      .and("contain", "Log Out");
  });

  it("should NOT login with an invalid username and valid password", () => {
    cy.loginWithUI("fake@username.123", testuserData.password);

    cy.url().should("contain", "/accounts/login/");

    cy.get("[data-test=user-greet]")
      .should("be.visible")
      .and("contain", "You are not logged in")
      .and("contain", "Sign Up")
      .and("contain", "Log In");

    cy.get("[data-test=container]").should(
      "contain",
      "Your username and password didn't match. Please try again."
    );
  });

  it("should NOT login with valid username and invalid password", () => {
    cy.loginWithUI(testuserData.username, "Fakepassword54321");

    cy.url().should("contain", "/accounts/login/");

    cy.get("[data-test=user-greet]")
      .should("be.visible")
      .and("contain", "You are not logged in")
      .and("contain", "Sign Up")
      .and("contain", "Log In");

    cy.get("[data-test=container]").should(
      "contain",
      "Your username and password didn't match. Please try again."
    );
  });
});
