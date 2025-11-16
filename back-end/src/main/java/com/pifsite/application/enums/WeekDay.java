package com.pifsite.application.enums;

public enum WeekDay {
    SEGUNDA("segunda"),
    TERCA("terca"),
    QUARTA("quarta"),
    QUINTA("quinta"),
    SEXTA("sexta"),
    SABADO("sabado"),
    DOMINGO("domingo");

    private String weekDay;

    private WeekDay(String role) {
        this.weekDay = role;
    }

    public String getWeekDay() {
        return weekDay;
    }

    public static WeekDay fromString(String weekDay) {
        for (WeekDay dayOfWeek : WeekDay.values()) {
            if (dayOfWeek.getWeekDay().equalsIgnoreCase(weekDay)) {
                return dayOfWeek;
            }
        }
        return null;
    }
}
