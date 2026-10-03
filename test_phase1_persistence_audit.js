/**
 * LANDScope — Phase 1 Persistence Audit Suite
 * Exhaustively validates all 20 steps of the Research + Evidence Persistence Migration:
 * 1. Login as researcher
 * 2. Open Research Workspace
 * 3. Create a new research project
 * 4. Refresh browser (Fetch projects again)
 * 5. Confirm project still exists
 * 6. Open project (Fetch project details)
 * 7. Add evidence
 * 8. Refresh browser (Fetch evidence again)
 * 9. Confirm evidence still exists
 * 10. Add research question
 * 11. Refresh browser (Fetch project again)
 * 12. Confirm question persists
 * 13. Link evidence to project
 * 14. Refresh browser (Fetch project again)
 * 15. Confirm relationship persists
 * 16. Open evidence details
 * 17. Verify geography relationship
 * 18. Verify unauthorized access is rejected
 * 19. Verify logout/authentication behavior
 * 20. Verify existing RBAC behavior has not regressed
 * + Bonus: Update project (PATCH), Update evidence (PATCH), Delete project (DELETE)
 */

const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('================================================================');
  console.log('LANDScope PHASE 1: RESEARCH + EVIDENCE PERSISTENCE AUDIT');
  console.log('================================================================\n');

  let passed = 0;
  let total = 20;

  // Step 1: Login as researcher
  console.log('STEP 1: Logging in as RESEARCHER (researcher@landscope.demo)...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'researcher@landscope.demo' }
  );
  if (loginRes.status === 200 && loginRes.body.success) {
    console.log('  [PASS] Step 1: Authenticated successfully as RESEARCHER');
    passed++;
  } else {
    console.error('  [FAIL] Step 1: Login failed', loginRes);
    process.exit(1);
  }
  const setCookie = loginRes.headers['set-cookie'];
  const cookies = Array.isArray(setCookie) ? setCookie.map((c) => c.split(';')[0]).join('; ') : '';

  // Step 2: Open Research Workspace (Fetch projects)
  console.log('STEP 2: Opening Research Workspace (GET /api/research/projects)...');
  const wsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/research/projects',
    method: 'GET',
    headers: { Cookie: cookies },
  });
  if (wsRes.status === 200 && wsRes.body.success && Array.isArray(wsRes.body.projects)) {
    console.log(`  [PASS] Step 2: Retrieved workspace with ${wsRes.body.projectsCount} projects`);
    passed++;
  } else {
    console.error('  [FAIL] Step 2: Workspace fetch failed', wsRes);
    process.exit(1);
  }

  // Step 3: Create a new research project
  console.log('STEP 3: Creating a new persistent research project...');
  const testTitle = `Phase 1 Cadastral Integrity Study - ${Date.now()}`;
  const createProjRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/research/projects',
      method: 'POST',
      headers: { Cookie: cookies, 'Content-Type': 'application/json' },
    },
    {
      title: testTitle,
      subtitle: 'Sehore District Cadastral Boundary Study',
      description: 'Persistent study evaluating CORS station drone resurvey accuracy and dispute mitigation.',
      researchQuestions: [
        {
          question: 'Does centimeter-precision cadastral resurvey reduce boundary litigations by over 40%?',
          hypothesis: 'Boundary ambiguity in revenue courts drops exponentially with GNSS-referenced cadastres.',
        },
      ],
      geographyId: 'IN-MP-SEH-ASH',
      state: 'Madhya Pradesh',
      district: 'Sehore',
      tehsil: 'Ashta',
    }
  );
  if (createProjRes.status === 201 && createProjRes.body.project && createProjRes.body.project.id) {
    console.log(`  [PASS] Step 3: Created project with ID: ${createProjRes.body.project.id}`);
    passed++;
  } else {
    console.error('  [FAIL] Step 3: Project creation failed', createProjRes);
    process.exit(1);
  }
  const createdProject = createProjRes.body.project;

  // Step 4 & 5: Refresh browser and confirm project still exists
  console.log('STEP 4 & 5: Refreshing browser (re-fetching projects) & confirming persistence...');
  const refreshProjectsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/research/projects',
    method: 'GET',
    headers: { Cookie: cookies },
  });
  const foundProjInList = (refreshProjectsRes.body.projects || []).find((p) => p.id === createdProject.id);
  if (refreshProjectsRes.status === 200 && foundProjInList) {
    console.log(`  [PASS] Step 4 & 5: Verified project persists after refresh (ID: ${foundProjInList.id})`);
    passed += 2;
  } else {
    console.error('  [FAIL] Step 4 & 5: Project did not persist across refresh');
    process.exit(1);
  }

  // Step 6: Open project (Fetch project details)
  console.log(`STEP 6: Opening project details (GET /api/research/projects/${createdProject.id})...`);
  const getProjDetail = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/research/projects/${createdProject.id}`,
    method: 'GET',
    headers: { Cookie: cookies },
  });
  if (getProjDetail.status === 200 && getProjDetail.body.project.id === createdProject.id) {
    console.log(`  [PASS] Step 6: Opened project details successfully. Questions: ${getProjDetail.body.project.researchQuestions.length}`);
    passed++;
  } else {
    console.error('  [FAIL] Step 6: Could not open project details', getProjDetail);
    process.exit(1);
  }

  // Step 7: Add evidence
  console.log('STEP 7: Adding a new evidence record (POST /api/research/evidence)...');
  const createEvRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/research/evidence',
      method: 'POST',
      headers: { Cookie: cookies, 'Content-Type': 'application/json' },
    },
    {
      title: `Econometric Evaluation of Cadastral Resurveys - ${Date.now()}`,
      abstract: 'Longitudinal study across 84 villages in Sehore tracking title dispute resolution velocity and bank mortgage registration.',
      authorOrOrg: 'National Institute of Land Economics & Administrative Reforms',
      source: 'National Institute of Land Economics & Administrative Reforms',
      confidenceScore: 0.95,
      methodology: 'Quasi-experimental spatial discontinuity design with 2,400 agricultural parcels',
      researchDomain: 'Land Rights & Titling',
      state: 'Madhya Pradesh',
      district: 'Sehore',
      tehsil: 'Ashta',
      topics: ['Cadastre', 'Dispute Resolution', 'Titling'],
      evidenceStatus: 'Peer-Reviewed',
    }
  );
  if (createEvRes.status === 201 && createEvRes.body.evidence && createEvRes.body.evidence.id) {
    console.log(`  [PASS] Step 7: Created evidence record with ID: ${createEvRes.body.evidence.id}`);
    passed++;
  } else {
    console.error('  [FAIL] Step 7: Evidence creation failed', createEvRes);
    process.exit(1);
  }
  const createdEvidence = createEvRes.body.evidence;

  // Step 8 & 9: Refresh browser and confirm evidence still exists
  console.log('STEP 8 & 9: Refreshing browser (re-fetching evidence) & confirming persistence...');
  const refreshEvRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/research/evidence',
    method: 'GET',
    headers: { Cookie: cookies },
  });
  const foundEvInList = (refreshEvRes.body.evidence || []).find((e) => e.id === createdEvidence.id);
  if (refreshEvRes.status === 200 && foundEvInList) {
    console.log(`  [PASS] Step 8 & 9: Verified evidence persists in central catalog (ID: ${foundEvInList.id})`);
    passed += 2;
  } else {
    console.error('  [FAIL] Step 8 & 9: Evidence did not persist across refresh');
    process.exit(1);
  }

  // Step 10: Add research question
  console.log(`STEP 10: Adding research question to project ${createdProject.id}...`);
  const addQRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/research/projects/${createdProject.id}/questions`,
      method: 'POST',
      headers: { Cookie: cookies, 'Content-Type': 'application/json' },
    },
    {
      question: 'What is the rate of credit collateral recognition for SVAMITVA property cards among local rural banks?',
    }
  );
  if (addQRes.status === 201 && addQRes.body.question) {
    console.log(`  [PASS] Step 10: Added research question with ID: ${addQRes.body.question.id}`);
    passed++;
  } else {
    console.error('  [FAIL] Step 10: Research question creation failed', addQRes);
    process.exit(1);
  }
  const addedQuestion = addQRes.body.question;

  // Step 11 & 12: Refresh browser and confirm question persists
  console.log('STEP 11 & 12: Refreshing browser & confirming research question persists in project...');
  const reloadProjForQ = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/research/projects/${createdProject.id}`,
    method: 'GET',
    headers: { Cookie: cookies },
  });
  const questionExists = (reloadProjForQ.body.project.researchQuestions || []).some(
    (q) => q.question === addedQuestion.question || q.id === addedQuestion.id
  );
  if (reloadProjForQ.status === 200 && questionExists) {
    console.log(`  [PASS] Step 11 & 12: Verified question persisted in project (Total questions: ${reloadProjForQ.body.project.researchQuestions.length})`);
    passed += 2;
  } else {
    console.error('  [FAIL] Step 11 & 12: Research question failed to persist');
    process.exit(1);
  }

  // Step 13: Link evidence to project
  console.log(`STEP 13: Linking evidence ${createdEvidence.id} to project ${createdProject.id}...`);
  const linkRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/research/projects/${createdProject.id}/evidence`,
      method: 'POST',
      headers: { Cookie: cookies, 'Content-Type': 'application/json' },
    },
    {
      evidenceId: createdEvidence.id,
    }
  );
  if (linkRes.status === 200 && linkRes.body.success) {
    console.log(`  [PASS] Step 13: Successfully linked evidence to project`);
    passed++;
  } else {
    console.error('  [FAIL] Step 13: Linking evidence failed', linkRes);
    process.exit(1);
  }

  // Step 14 & 15: Refresh browser and confirm relationship persists
  console.log('STEP 14 & 15: Refreshing browser & confirming project-evidence link persists...');
  const reloadProjForLink = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/research/projects/${createdProject.id}`,
    method: 'GET',
    headers: { Cookie: cookies },
  });
  const isLinked = (reloadProjForLink.body.project.evidenceIds || []).includes(createdEvidence.id);
  if (reloadProjForLink.status === 200 && isLinked) {
    console.log(`  [PASS] Step 14 & 15: Project-evidence link confirmed (Evidence count: ${reloadProjForLink.body.project.evidenceCount})`);
    passed += 2;
  } else {
    console.error('  [FAIL] Step 14 & 15: Evidence link failed to persist');
    process.exit(1);
  }

  // Step 16: Open evidence details
  console.log(`STEP 16: Opening evidence details (GET /api/research/evidence/${createdEvidence.id})...`);
  const evDetailRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/research/evidence/${createdEvidence.id}`,
    method: 'GET',
    headers: { Cookie: cookies },
  });
  if (evDetailRes.status === 200 && evDetailRes.body.evidence && evDetailRes.body.evidence.id === createdEvidence.id) {
    console.log(`  [PASS] Step 16: Evidence details retrieved. Label: "${evDetailRes.body.demonstrationLabel}"`);
    passed++;
  } else {
    console.error('  [FAIL] Step 16: Failed to get evidence details', evDetailRes);
    process.exit(1);
  }

  // Step 17: Verify geography relationship
  console.log('STEP 17: Verifying geography relationship (State: Madhya Pradesh, District: Sehore, Tehsil: Ashta)...');
  const evGeo = evDetailRes.body.evidence.geography;
  if (evGeo && evGeo.state === 'Madhya Pradesh' && evGeo.district === 'Sehore' && evGeo.tehsil === 'Ashta') {
    console.log(`  [PASS] Step 17: Verified geography relationship matches territory specification`);
    passed++;
  } else {
    console.error('  [FAIL] Step 17: Geography mismatch', evGeo);
    process.exit(1);
  }

  // Step 18: Verify unauthorized access is rejected
  console.log('STEP 18: Verifying unauthorized role (POLICYMAKER) cannot access private researcher project...');
  const policyLogin = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'policymaker@landscope.demo' }
  );
  const policyCookies = (policyLogin.headers['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ');
  const policyAccessRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/research/projects/${createdProject.id}`,
    method: 'GET',
    headers: { Cookie: policyCookies },
  });
  if (policyAccessRes.status === 403) {
    console.log(`  [PASS] Step 18: Policymaker received 403 FORBIDDEN (${policyAccessRes.body.message})`);
    passed++;
  } else {
    console.error(`  [FAIL] Step 18: Expected 403, got ${policyAccessRes.status}`);
    process.exit(1);
  }

  // Step 19: Verify logout / unauthenticated behavior
  console.log('STEP 19: Verifying unauthenticated request is rejected with 401 UNAUTHORIZED...');
  const unauthRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/research/projects/${createdProject.id}`,
    method: 'GET',
  });
  if (unauthRes.status === 401) {
    console.log(`  [PASS] Step 19: Unauthenticated request rejected with 401 UNAUTHORIZED`);
    passed++;
  } else {
    console.error(`  [FAIL] Step 19: Expected 401, got ${unauthRes.status}`);
    process.exit(1);
  }

  // Step 20: Verify existing RBAC behavior has not regressed
  console.log('STEP 20: Verifying general RBAC authorization integrity...');
  // ACADEMIC_INSTITUTION should have access
  const acadLogin = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'academic@landscope.demo' }
  );
  const acadCookies = (acadLogin.headers['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ');
  const acadRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/research/projects',
    method: 'GET',
    headers: { Cookie: acadCookies },
  });
  // PUBLIC should be forbidden
  const pubLogin = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'public@landscope.demo' }
  );
  const pubCookies = (pubLogin.headers['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ');
  const pubRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/research/projects',
    method: 'GET',
    headers: { Cookie: pubCookies },
  });

  if (acadRes.status === 200 && pubRes.status === 403) {
    console.log(`  [PASS] Step 20: RBAC intact (Academic 200 OK, Public 403 FORBIDDEN)`);
    passed++;
  } else {
    console.error(`  [FAIL] Step 20: RBAC regression detected`, { acad: acadRes.status, pub: pubRes.status });
    process.exit(1);
  }

  // Bonus Checks: Test Project Update (PATCH), Evidence Update (PATCH), and Project Deletion (DELETE)
  console.log('\nBONUS CHECKS: Testing CRUD Update (PATCH) and Delete (DELETE)...');
  const updateProjRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/research/projects/${createdProject.id}`,
      method: 'PATCH',
      headers: { Cookie: cookies, 'Content-Type': 'application/json' },
    },
    {
      description: 'Updated description through persistent PATCH API route.',
      status: 'In Progress',
    }
  );
  if (updateProjRes.status === 200 && updateProjRes.body.success) {
    console.log(`  [PASS] Bonus: Successfully updated project via PATCH`);
  } else {
    console.warn(`  [WARN] Bonus: Project update returned ${updateProjRes.status}`);
  }

  const updateEvRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/research/evidence/${createdEvidence.id}`,
      method: 'PATCH',
      headers: { Cookie: cookies, 'Content-Type': 'application/json' },
    },
    {
      confidenceScore: 0.98,
      evidenceStatus: 'Peer-Reviewed',
    }
  );
  if (updateEvRes.status === 200 && updateEvRes.body.success) {
    console.log(`  [PASS] Bonus: Successfully updated evidence via PATCH`);
  } else {
    console.warn(`  [WARN] Bonus: Evidence update returned ${updateEvRes.status}`);
  }

  const deleteProjRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/research/projects/${createdProject.id}`,
    method: 'DELETE',
    headers: { Cookie: cookies },
  });
  if (deleteProjRes.status === 200 && deleteProjRes.body.success) {
    console.log(`  [PASS] Bonus: Successfully deleted test project via DELETE`);
  } else {
    console.warn(`  [WARN] Bonus: Project delete returned ${deleteProjRes.status}`);
  }

  console.log('\n================================================================');
  console.log(`AUDIT COMPLETE: ${passed}/${total} STEPS PASSED (100%)`);
  console.log('================================================================');
}

runAudit().catch((err) => {
  console.error('Persistence audit encountered an unexpected error:', err);
  process.exit(1);
});
