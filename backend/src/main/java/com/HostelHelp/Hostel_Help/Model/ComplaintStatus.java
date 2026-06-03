package com.HostelHelp.Hostel_Help.Model;

public enum ComplaintStatus {
    PENDING,        // just submitted by student
    ASSIGNED,       // admin assigned to a warden
    IN_PROGRESS,    // warden started working
    RESOLVED,       // warden marked as done (legacy)
    RESOLVED_PENDING, // warden resolved, awaiting student approval
    CLOSED,         // student verified and closed the complaint
    REOPENED,       // student dissatisfied and reopened the complaint
    REJECTED        // warden rejected with reason
}
