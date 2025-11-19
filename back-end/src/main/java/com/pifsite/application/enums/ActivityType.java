package com.pifsite.application.enums;

public enum ActivityType {
    PROVA("prova"),
    TRABALHO("trabalho"),
    RECUPERACAO("recuperacao"),
    EXTRA("extra");

    private String role;

    private ActivityType(String activity) {
        this.role = activity;
    }

    public String getRole() {
        return role;
    }

    public static ActivityType fromString(String activity) {
        for (ActivityType activityType : ActivityType
                .values()) {
            if (activityType.getRole().equalsIgnoreCase(activity)) {
                return activityType;
            }
        }
        return null;
    }
}
