package com.pifsite.application.security;

public enum UserRoles {
    USER("user"),
    ADMIN("admin"),
    PROFESSOR("professor"),
    STUDENT("student");

    private String role;

    private UserRoles(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public static UserRoles fromString(String role) {
        for (UserRoles userRole : UserRoles.values()) {
            if (userRole.getRole().equalsIgnoreCase(role)) {
                return userRole;
            }
        }
        return null; // UserRoles.STUDENT como padrão
    }
}
