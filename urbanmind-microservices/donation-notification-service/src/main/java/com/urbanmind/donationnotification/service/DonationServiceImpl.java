package com.urbanmind.donationnotification.service;

import com.razorpay.Order;
import java.math.BigDecimal;
import com.urbanmind.donationnotification.dto.DonationRequestDto;
import com.urbanmind.donationnotification.dto.DonationResponseDto;
import com.urbanmind.donationnotification.dto.PaymentRequestDto;
import com.urbanmind.donationnotification.entity.Donation;
import com.urbanmind.donationnotification.exception.ResourceNotFoundException;
import com.urbanmind.donationnotification.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final RazorpayService razorpayService;

    @Autowired

    public DonationServiceImpl(DonationRepository donationRepository,
            RazorpayService razorpayService) {
        this.donationRepository = donationRepository;
        this.razorpayService = razorpayService;
    }

    @Override
    @Transactional
    public DonationResponseDto createDonation(DonationRequestDto dto) {

        try {
            // 1️⃣ Create Razorpay order
            Order order = razorpayService.createOrder(dto.getAmount().doubleValue());

            // 2️⃣ Save donation in DB
            Donation donation = new Donation();
            donation.setProblemId(dto.getProblemId());
            donation.setDonorUserId(dto.getDonorUserId());
            donation.setReceiverUserId(dto.getReceiverUserId());
            donation.setAmount(dto.getAmount());
            donation.setCurrency("INR");
            donation.setPaymentGateway("RAZORPAY");
            donation.setStatus("CREATED");
            donation.setGatewayOrderId(order.get("id"));

            Donation savedDonation = donationRepository.save(donation);

            return convertToResponseDto(savedDonation);

        } catch (Exception e) {
            throw new RuntimeException("Razorpay order creation failed", e);
        }
    }

    @Override
    public DonationResponseDto getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation", "id", id));
        return convertToResponseDto(donation);
    }

    @Override
    public List<DonationResponseDto> getDonationsByUserId(Long userId) {
        List<Donation> donorDonations = donationRepository.findByDonorUserId(userId);
        List<Donation> receiverDonations = donationRepository.findByReceiverUserId(userId);

        donorDonations.addAll(receiverDonations);

        return donorDonations.stream()
                .distinct()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DonationResponseDto processPayment(Long donationId, PaymentRequestDto paymentRequestDto) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation", "id", donationId));

        donation.setGatewayPaymentId(paymentRequestDto.getGatewayPaymentId());
        donation.setGatewaySignature(paymentRequestDto.getGatewaySignature());
        donation.setPaymentMethod(paymentRequestDto.getPaymentMethod());
        donation.setStatus("SUCCESS");
        donation.setPaidAt(OffsetDateTime.now());

        Donation updatedDonation = donationRepository.save(donation);
        return convertToResponseDto(updatedDonation);
    }

    @Override
    @Transactional
    public DonationResponseDto handleWebhook(String gatewayOrderId, Map<String, Object> payload) {
        Donation donation = donationRepository.findByGatewayOrderId(gatewayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation", "gatewayOrderId", gatewayOrderId));

        donation.setLastGatewayEvent(payload.getOrDefault("event", "").toString());
        donation.setLastEventReceivedAt(OffsetDateTime.now());

        String status = payload.getOrDefault("status", "").toString();
        if ("PAID".equalsIgnoreCase(status) || "SUCCESS".equalsIgnoreCase(status)) {
            donation.setStatus("SUCCESS");
            donation.setPaidAt(OffsetDateTime.now());
        } else if ("FAILED".equalsIgnoreCase(status)) {
            donation.setStatus("FAILED");
            donation.setFailureReason(payload.getOrDefault("error_reason", "").toString());
        }

        Donation updatedDonation = donationRepository.save(donation);
        return convertToResponseDto(updatedDonation);
    }

    @Override
    public List<DonationResponseDto> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    private DonationResponseDto convertToResponseDto(Donation donation) {
        DonationResponseDto dto = new DonationResponseDto();
        dto.setId(donation.getId());
        dto.setProblemId(donation.getProblemId());
        dto.setDonorUserId(donation.getDonorUserId());
        dto.setReceiverUserId(donation.getReceiverUserId());
        dto.setAmount(donation.getAmount());
        dto.setCurrency(donation.getCurrency());
        dto.setPaymentGateway(donation.getPaymentGateway());
        dto.setStatus(donation.getStatus());
        dto.setGatewayOrderId(donation.getGatewayOrderId());
        dto.setGatewayPaymentId(donation.getGatewayPaymentId());
        dto.setPaymentMethod(donation.getPaymentMethod());
        dto.setCreatedAt(donation.getCreatedAt());
        dto.setPaidAt(donation.getPaidAt());
        return dto;
    }

    private String generateOrderId() {
        return "ORDER_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    @Override
    public List<DonationResponseDto> getDonationsByProblem(Long problemId) {
        return donationRepository.findByProblemId(problemId)
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

}
