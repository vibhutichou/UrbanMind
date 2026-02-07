package org.urbanmind.UrbanChats.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.urbanmind.UrbanChats.DTO.ReportRequestDto;
import org.urbanmind.UrbanChats.DTO.ReportResponseDto;
import org.urbanmind.UrbanChats.Entity.Reports;
import org.urbanmind.UrbanChats.Repository.ReportsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportsService {

    @Autowired
    private ReportsRepository reportsRepository;

    

    public Page<ReportResponseDto> getReportsByStatusPaginated(
            String status,
            int page,
            int size) {

        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return reportsRepository
                .findByStatus(status, pageable)
                .map(this::mapToResponse);
    }

    // Create report
    public ReportResponseDto createReport(ReportRequestDto dto) {

        Reports report = new Reports();
        report.setReporterUserId(dto.getReporterUserId());
        report.setTargetType(dto.getTargetType());
        report.setTargetId(dto.getTargetId());
        report.setReasonCode(dto.getReasonCode());
        report.setReasonText(dto.getReasonText());
        report.setStatus("PENDING");
        report.setCreatedAt(OffsetDateTime.now());

        Reports saved = reportsRepository.save(report);

        return mapToResponse(saved);
    }

    // Admin: get reports by status
    public List<ReportResponseDto> getReportsByStatus(String status) {

        return reportsRepository
                .findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    public ReportResponseDto getReportById(Long id) {

        Reports report = reportsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        return mapToResponse(report);
    }

    public void updateReportStatus(Long id, String status) {

        Reports report = reportsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(status);
        report.setUpdatedAt(OffsetDateTime.now());

        reportsRepository.save(report);
    }


    // Mapper
    private ReportResponseDto mapToResponse(Reports report) {

        ReportResponseDto dto = new ReportResponseDto();
        dto.setId(report.getId());
        dto.setReporterUserId(report.getReporterUserId());
        dto.setTargetType(report.getTargetType());
        dto.setTargetId(report.getTargetId());
        dto.setReasonCode(report.getReasonCode());
        dto.setReasonText(report.getReasonText());
        dto.setStatus(report.getStatus());
        dto.setHandledByAdminId(report.getHandledByAdminId());
        dto.setAction(report.getAction());
        dto.setActionReason(report.getActionReason());
        dto.setHandledAt(report.getHandledAt());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setUpdatedAt(report.getUpdatedAt());

        return dto;
    }
}
