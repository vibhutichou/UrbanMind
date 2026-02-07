
package org.urbanmind.UrbanChats.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.urbanmind.UrbanChats.DTO.ReportResponseDto;
import org.urbanmind.UrbanChats.Service.ReportsService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reports")
public class AdminReportsController {

    @Autowired
    private ReportsService reportsService;

//    // Get reports by status
//    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public List<ReportResponseDto> getReportsByStatus(
//            @RequestParam String status) {
//        return reportsService.getReportsByStatus(status);
//    }

    // Update report status (placeholder)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public void updateReportStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        reportsService.updateReportStatus(id, status);
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public org.springframework.data.domain.Page<ReportResponseDto> getReportsByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return reportsService.getReportsByStatusPaginated(status, page, size);
    }

}
