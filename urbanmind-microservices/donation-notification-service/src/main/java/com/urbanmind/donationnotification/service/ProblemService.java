package com.urbanmind.donationnotification.service;

import com.urbanmind.donationnotification.dto.MarkDonationRequestDto;
import com.urbanmind.donationnotification.entity.Problem;

import java.util.List;

public interface ProblemService {
    Problem markDonation(Long problemId, MarkDonationRequestDto dto);

    List<Problem> getDonationRequiredProblems();

    Problem getProblemById(Long id);
}
