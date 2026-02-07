package com.urbanmind.donationnotification.service;

import com.urbanmind.donationnotification.dto.DonationRequestDto;
import com.urbanmind.donationnotification.dto.DonationResponseDto;
import com.urbanmind.donationnotification.dto.PaymentRequestDto;
import java.util.List;
import java.util.Map;

public interface DonationService {
    
    DonationResponseDto createDonation(DonationRequestDto donationRequestDto);
    
    DonationResponseDto getDonationById(Long id);
    
    List<DonationResponseDto> getDonationsByUserId(Long userId);
    
    DonationResponseDto processPayment(Long donationId, PaymentRequestDto paymentRequestDto);
    
    DonationResponseDto handleWebhook(String gatewayOrderId, Map<String, Object> payload);
    
    List<DonationResponseDto> getAllDonations();
    List<DonationResponseDto> getDonationsByProblem(Long problemId);

}
