package com.urbanmind.donationnotification.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.urbanmind.donationnotification.dto.MarkDonationRequestDto;
import com.urbanmind.donationnotification.entity.Problem;
import com.urbanmind.donationnotification.exception.ApiResponse;
import com.urbanmind.donationnotification.service.ProblemService;

@RestController
@RequestMapping("/api/v1/problems")
public class ProblemController {

    private final ProblemService problemService;

    @Autowired
    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @PutMapping("/{problemId}/mark-donation")
    public ResponseEntity<ApiResponse> markProblemForDonation(
            @PathVariable Long problemId,
            @RequestBody MarkDonationRequestDto dto) {

        Problem problem = problemService.markDonation(problemId, dto);

        return ResponseEntity.ok(
                new ApiResponse(true, "Problem marked for donation", problem));
    }

    @GetMapping("/donation-required")
    public ResponseEntity<ApiResponse> getDonationRequiredProblems() {
        List<Problem> problems = problemService.getDonationRequiredProblems();
        return ResponseEntity.ok(new ApiResponse(true, "Donation required problems fetched successfully", problems));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProblemById(@PathVariable Long id) {
        Problem problem = problemService.getProblemById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Problem fetched successfully", problem));
    }
}
