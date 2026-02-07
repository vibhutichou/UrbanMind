package com.urbanmind.donationnotification.controller;

import com.urbanmind.donationnotification.dto.DonationRequestDto;
import com.urbanmind.donationnotification.dto.DonationResponseDto;
import com.urbanmind.donationnotification.dto.PaymentRequestDto;
import com.urbanmind.donationnotification.exception.ApiResponse;
import com.urbanmind.donationnotification.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/donations")
public class DonationController {

    private final DonationService donationService;

    @Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createDonation(@Valid @RequestBody DonationRequestDto donationRequestDto) {
        DonationResponseDto donation = donationService.createDonation(donationRequestDto);
        ApiResponse response = new ApiResponse(true, "Donation created successfully", donation);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getDonationById(@PathVariable Long id) {
        DonationResponseDto donation = donationService.getDonationById(id);
        ApiResponse response = new ApiResponse(true, "Donation retrieved successfully", donation);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse> getUserDonations(@PathVariable Long userId) {
        List<DonationResponseDto> donations = donationService.getDonationsByUserId(userId);
        ApiResponse response = new ApiResponse(true, "User donations retrieved successfully", donations);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse> processPayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequestDto paymentRequestDto) {
        DonationResponseDto donation = donationService.processPayment(id, paymentRequestDto);
        ApiResponse response = new ApiResponse(true, "Payment processed successfully", donation);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/payments/webhook")
    public ResponseEntity<ApiResponse> handleWebhook(@RequestBody Map<String, Object> payload) {
        String gatewayOrderId = payload.getOrDefault("order_id", "").toString();
        DonationResponseDto donation = donationService.handleWebhook(gatewayOrderId, payload);
        ApiResponse response = new ApiResponse(true, "Webhook processed successfully", donation);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllDonations() {
        List<DonationResponseDto> donations = donationService.getAllDonations();
        ApiResponse response = new ApiResponse(true, "All donations retrieved successfully", donations);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<ApiResponse> getDonationsByProblem(@PathVariable Long problemId) {
        List<DonationResponseDto> donations = donationService.getDonationsByProblem(problemId);
        return ResponseEntity.ok(new ApiResponse(true, "Problem donations", donations));
    }

    @PostMapping("/{donationId}/verify-payment")
    public ResponseEntity<ApiResponse> verifyPayment(
            @PathVariable Long donationId,
            @RequestBody PaymentRequestDto dto) {

        DonationResponseDto donation = donationService.processPayment(donationId, dto);

        return ResponseEntity.ok(new ApiResponse(true, "Payment successful", donation));
    }

}
