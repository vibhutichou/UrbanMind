package com.urbanmind.donationnotification.repository;

import com.urbanmind.donationnotification.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    
    List<Donation> findByDonorUserId(Long donorUserId);
    
    List<Donation> findByReceiverUserId(Long receiverUserId);
    
    List<Donation> findByProblemId(Long problemId);
    
    Optional<Donation> findByGatewayOrderId(String gatewayOrderId);
    
    List<Donation> findByStatus(String status);
}
