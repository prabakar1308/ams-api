import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1749033100297 implements MigrationInterface {
    name = 'FirstMigration1749033100297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "master"."unit_sector" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(256), "location" character varying(256), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3feefe03383324a3a40455464a7" UNIQUE ("name"), CONSTRAINT "PK_496ed18ce535955505e7da76f0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."harvest_type" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "value" character varying(50) NOT NULL, "description" character varying(256), "harvestTime" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_25792bbbe29c214dfd041ff57ee" UNIQUE ("value"), CONSTRAINT "PK_fc76add171d0bc662bd32ebb8a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."tank_type" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "value" character varying(50) NOT NULL, "description" character varying(256), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "limit" integer NOT NULL, CONSTRAINT "UQ_de8b75e1f9e02445680c3871201" UNIQUE ("value"), CONSTRAINT "PK_1a9ae10c42b537a6f57f7293a93" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."worksheet_status" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "value" character varying(50) NOT NULL, "description" character varying(256), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bb3a977dd649ff9ae3d14cadaf1" UNIQUE ("value"), CONSTRAINT "PK_6a3634099504329816051a8abff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."worksheet_unit" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "value" character varying(50) NOT NULL, "brand" character varying(50), "specs" character varying(256), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_82848e31594a341a3e70827669d" UNIQUE ("value"), CONSTRAINT "PK_c531dc5cbfcda61fcc6b01794c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "worksheet"."harvest" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "count" integer NOT NULL, "countInStock" integer, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "worksheetId" integer, "unitId" integer, "measuredById" integer, CONSTRAINT "REL_44be1133af8472cd8d81b4a1a2" UNIQUE ("worksheetId"), CONSTRAINT "PK_84a837e6c60baad24c5a4125f67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "worksheet"."restock" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "count" integer NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "worksheetId" integer, "harvestId" integer, "unitId" integer, CONSTRAINT "REL_3ed3f807fbad0382c213c95731" UNIQUE ("worksheetId"), CONSTRAINT "REL_7ce79411c25cccbf6e073eea39" UNIQUE ("harvestId"), CONSTRAINT "PK_8eda7cd42ca4eb8d032f2720a3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "worksheet"."worksheet" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "ph" numeric(2,1) NOT NULL, "salnity" integer NOT NULL, "temperature" integer NOT NULL, "tankNumber" integer NOT NULL, "harvestTime" TIMESTAMP, "harvestHours" integer NOT NULL, "inputCount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "statusId" integer, "tankTypeId" integer, "harvestTypeId" integer, "inputUnitId" integer, "userId" integer, CONSTRAINT "PK_4288372d711457f58abb7dd90c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."user" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "userCode" character varying(50) NOT NULL, "firstName" character varying(96) NOT NULL, "lastName" character varying(96) NOT NULL, "password" character varying(96) NOT NULL, "email" character varying(96), "mobileNumber" character varying NOT NULL, "role" character varying NOT NULL, "designation" character varying NOT NULL, "dateOfBirth" TIMESTAMP NOT NULL, "address" character varying NOT NULL, "dateOfJoining" TIMESTAMP NOT NULL, "remarks" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "unitSectorId" integer NOT NULL, CONSTRAINT "UQ_6bd3b94c05cc2bd28326e542279" UNIQUE ("userCode"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "worksheet"."worksheet_history" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "previousValue" character varying(255), "currentValue" character varying(255), "action" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "worksheetId" integer, CONSTRAINT "PK_1b894f4d6bc649a728afe89808b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "worksheet"."transit" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "count" integer NOT NULL, "staffInCharge" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "harvestId" integer, "unitSectorId" integer, "unitId" integer, CONSTRAINT "PK_4c4434f94b64438c656fa19fc2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."unit" ("createdBy" integer NOT NULL, "updatedBy" integer, "id" SERIAL NOT NULL, "value" character varying(50) NOT NULL, "description" character varying(256), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5464c78b1c213e790759031c38d" UNIQUE ("value"), CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."temperature" ("id" SERIAL NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "defaultValue" numeric, "step" numeric, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, "updatedBy" integer, "unitId" integer, CONSTRAINT "PK_3b69dc45d57daf28f4b930eb4c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."tank" ("id" SERIAL NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "defaultValue" numeric, "step" numeric, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, "updatedBy" integer, "unitId" integer, CONSTRAINT "PK_7c34d00328207090cdf572bb15a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."salnity" ("id" SERIAL NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "defaultValue" numeric, "step" numeric, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, "updatedBy" integer, "unitId" integer, CONSTRAINT "PK_9c42724a9a0668a1ae68cc45168" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "master"."ph" ("id" SERIAL NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "defaultValue" numeric, "step" numeric, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, "updatedBy" integer, "unitId" integer, CONSTRAINT "PK_9e30d2027cafef82c8d29a20f55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "worksheet"."worksheet_restocks_restock" ("worksheetId" integer NOT NULL, "restockId" integer NOT NULL, CONSTRAINT "PK_c6a159846a50711b5f5ec67384d" PRIMARY KEY ("worksheetId", "restockId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5075b3adb21816f32558122320" ON "worksheet"."worksheet_restocks_restock" ("worksheetId") `);
        await queryRunner.query(`CREATE INDEX "IDX_af1efc26ab637df90bd655be9d" ON "worksheet"."worksheet_restocks_restock" ("restockId") `);
        await queryRunner.query(`ALTER TABLE "worksheet"."harvest" ADD CONSTRAINT "FK_44be1133af8472cd8d81b4a1a21" FOREIGN KEY ("worksheetId") REFERENCES "worksheet"."worksheet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."harvest" ADD CONSTRAINT "FK_b5c471d23d9283980fb140b5416" FOREIGN KEY ("unitId") REFERENCES "master"."worksheet_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."harvest" ADD CONSTRAINT "FK_2770366cddff5ae8ebe65114693" FOREIGN KEY ("measuredById") REFERENCES "master"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."restock" ADD CONSTRAINT "FK_3ed3f807fbad0382c213c957319" FOREIGN KEY ("worksheetId") REFERENCES "worksheet"."worksheet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."restock" ADD CONSTRAINT "FK_7ce79411c25cccbf6e073eea399" FOREIGN KEY ("harvestId") REFERENCES "worksheet"."harvest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."restock" ADD CONSTRAINT "FK_fd6106c8cbe2fb52d8b04375539" FOREIGN KEY ("unitId") REFERENCES "master"."worksheet_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" ADD CONSTRAINT "FK_7404db2bf0876bbf214900ac3b8" FOREIGN KEY ("statusId") REFERENCES "master"."worksheet_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" ADD CONSTRAINT "FK_05e6702e5a44bed59bc96ee2543" FOREIGN KEY ("tankTypeId") REFERENCES "master"."tank_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" ADD CONSTRAINT "FK_15fc4f2082cf591a0489d42ba22" FOREIGN KEY ("harvestTypeId") REFERENCES "master"."harvest_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" ADD CONSTRAINT "FK_328f193c9961ba92f278a95e92c" FOREIGN KEY ("inputUnitId") REFERENCES "master"."worksheet_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" ADD CONSTRAINT "FK_cd5d97c3620650be06f43d20073" FOREIGN KEY ("userId") REFERENCES "master"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "master"."user" ADD CONSTRAINT "FK_f8dab5670cb554171f77115059b" FOREIGN KEY ("unitSectorId") REFERENCES "master"."unit_sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet_history" ADD CONSTRAINT "FK_a7f549ad1243a4bfb7dfe8bfb0d" FOREIGN KEY ("worksheetId") REFERENCES "worksheet"."worksheet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."transit" ADD CONSTRAINT "FK_b59269f238b1856d55473d6e9c3" FOREIGN KEY ("harvestId") REFERENCES "worksheet"."harvest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."transit" ADD CONSTRAINT "FK_967ddc5a66e73adcbd807e9686f" FOREIGN KEY ("unitSectorId") REFERENCES "master"."unit_sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."transit" ADD CONSTRAINT "FK_c31eab06f982b73cc4bb46056ab" FOREIGN KEY ("unitId") REFERENCES "master"."worksheet_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "master"."temperature" ADD CONSTRAINT "FK_ffba883703617d772e0977565a1" FOREIGN KEY ("unitId") REFERENCES "master"."unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "master"."tank" ADD CONSTRAINT "FK_3974eba61e7a87a9f3a5d33740c" FOREIGN KEY ("unitId") REFERENCES "master"."unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "master"."salnity" ADD CONSTRAINT "FK_1df4c7bec3190d281a9bc4019a2" FOREIGN KEY ("unitId") REFERENCES "master"."unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "master"."ph" ADD CONSTRAINT "FK_9a6f5b82143dba710cca2374fd6" FOREIGN KEY ("unitId") REFERENCES "master"."unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet_restocks_restock" ADD CONSTRAINT "FK_5075b3adb21816f32558122320b" FOREIGN KEY ("worksheetId") REFERENCES "worksheet"."worksheet"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet_restocks_restock" ADD CONSTRAINT "FK_af1efc26ab637df90bd655be9d2" FOREIGN KEY ("restockId") REFERENCES "worksheet"."restock"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet_restocks_restock" DROP CONSTRAINT "FK_af1efc26ab637df90bd655be9d2"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet_restocks_restock" DROP CONSTRAINT "FK_5075b3adb21816f32558122320b"`);
        await queryRunner.query(`ALTER TABLE "master"."ph" DROP CONSTRAINT "FK_9a6f5b82143dba710cca2374fd6"`);
        await queryRunner.query(`ALTER TABLE "master"."salnity" DROP CONSTRAINT "FK_1df4c7bec3190d281a9bc4019a2"`);
        await queryRunner.query(`ALTER TABLE "master"."tank" DROP CONSTRAINT "FK_3974eba61e7a87a9f3a5d33740c"`);
        await queryRunner.query(`ALTER TABLE "master"."temperature" DROP CONSTRAINT "FK_ffba883703617d772e0977565a1"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."transit" DROP CONSTRAINT "FK_c31eab06f982b73cc4bb46056ab"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."transit" DROP CONSTRAINT "FK_967ddc5a66e73adcbd807e9686f"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."transit" DROP CONSTRAINT "FK_b59269f238b1856d55473d6e9c3"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet_history" DROP CONSTRAINT "FK_a7f549ad1243a4bfb7dfe8bfb0d"`);
        await queryRunner.query(`ALTER TABLE "master"."user" DROP CONSTRAINT "FK_f8dab5670cb554171f77115059b"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" DROP CONSTRAINT "FK_cd5d97c3620650be06f43d20073"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" DROP CONSTRAINT "FK_328f193c9961ba92f278a95e92c"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" DROP CONSTRAINT "FK_15fc4f2082cf591a0489d42ba22"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" DROP CONSTRAINT "FK_05e6702e5a44bed59bc96ee2543"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."worksheet" DROP CONSTRAINT "FK_7404db2bf0876bbf214900ac3b8"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."restock" DROP CONSTRAINT "FK_fd6106c8cbe2fb52d8b04375539"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."restock" DROP CONSTRAINT "FK_7ce79411c25cccbf6e073eea399"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."restock" DROP CONSTRAINT "FK_3ed3f807fbad0382c213c957319"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."harvest" DROP CONSTRAINT "FK_2770366cddff5ae8ebe65114693"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."harvest" DROP CONSTRAINT "FK_b5c471d23d9283980fb140b5416"`);
        await queryRunner.query(`ALTER TABLE "worksheet"."harvest" DROP CONSTRAINT "FK_44be1133af8472cd8d81b4a1a21"`);
        await queryRunner.query(`DROP INDEX "worksheet"."IDX_af1efc26ab637df90bd655be9d"`);
        await queryRunner.query(`DROP INDEX "worksheet"."IDX_5075b3adb21816f32558122320"`);
        await queryRunner.query(`DROP TABLE "worksheet"."worksheet_restocks_restock"`);
        await queryRunner.query(`DROP TABLE "master"."ph"`);
        await queryRunner.query(`DROP TABLE "master"."salnity"`);
        await queryRunner.query(`DROP TABLE "master"."tank"`);
        await queryRunner.query(`DROP TABLE "master"."temperature"`);
        await queryRunner.query(`DROP TABLE "master"."unit"`);
        await queryRunner.query(`DROP TABLE "worksheet"."transit"`);
        await queryRunner.query(`DROP TABLE "worksheet"."worksheet_history"`);
        await queryRunner.query(`DROP TABLE "master"."user"`);
        await queryRunner.query(`DROP TABLE "worksheet"."worksheet"`);
        await queryRunner.query(`DROP TABLE "worksheet"."restock"`);
        await queryRunner.query(`DROP TABLE "worksheet"."harvest"`);
        await queryRunner.query(`DROP TABLE "master"."worksheet_unit"`);
        await queryRunner.query(`DROP TABLE "master"."worksheet_status"`);
        await queryRunner.query(`DROP TABLE "master"."tank_type"`);
        await queryRunner.query(`DROP TABLE "master"."harvest_type"`);
        await queryRunner.query(`DROP TABLE "master"."unit_sector"`);
    }

}
