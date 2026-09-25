-- Datos: Godot 3D (godot-3d-xelda-realms-of-xhiggs) pasa de 16 a 24 semanas.
-- Solo UPDATEs: no borra módulos, así se conservan videoUrl y GroupModuleRelease.
-- Precio completo 239 -> 339. OJO: NO desplegar a producción hasta añadir aquí
-- el nuevo stripePriceIdYearly (339 €), o la web mostrará 339 y Stripe cobrará 239.

UPDATE "Course"
SET "duracion" = '24 semanas', "horas" = 36, "precioCompleto" = 339
WHERE "slug" = 'godot-3d-xelda-realms-of-xhiggs';

UPDATE "CourseModule" m
SET "semanas" = v.nuevo
FROM "Course" c,
     (VALUES
        ('Semanas 1-3',   'Semanas 1-4'),
        ('Semanas 4-6',   'Semanas 5-8'),
        ('Semanas 7-9',   'Semanas 9-12'),
        ('Semanas 10-11', 'Semanas 13-16'),
        ('Semanas 12-14', 'Semanas 17-20'),
        ('Semanas 15-16', 'Semanas 21-24')
     ) AS v(viejo, nuevo)
WHERE m."courseId" = c."id"
  AND c."slug" = 'godot-3d-xelda-realms-of-xhiggs'
  AND m."semanas" = v.viejo;
