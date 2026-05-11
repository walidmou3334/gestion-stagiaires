package com.backend.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveFile(MultipartFile file, String subFolder) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        Path folderPath = Paths.get(uploadDir, subFolder).toAbsolutePath().normalize();
        Files.createDirectories(folderPath);

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String newFileName = UUID.randomUUID() + extension;
        Path targetLocation = folderPath.resolve(newFileName);

        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return newFileName;
    }

    public Resource loadFileAsResource(String subFolder, String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, subFolder).toAbsolutePath().normalize().resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            }

            throw new RuntimeException("Fichier introuvable : " + fileName);
        } catch (Exception e) {
            throw new RuntimeException("Impossible de lire le fichier : " + fileName, e);
        }
    }
}