function fromSpherical([phi, theta]) {
	const z = Math.cos(phi);
	const sinPhi = Math.sin(phi);
	const x = sinPhi * Math.sin(theta);
	const y = sinPhi * Math.cos(theta);
	return [x, y, z];
}
function chooseNormal(j, J) {
	const s = j / J * 2 - 1;
	const side = s < 0 ? -1 : 1;
	const revs = Math.sqrt(J / 8);
	const thetaStep = revs * 4;
	const phi = Math.acos(1 - Math.abs(s)) * side;
	const theta = phi * thetaStep * side;
	return fromSpherical([phi, theta]);
}
function dot([ax, ay, az], [bx, by, bz]) {
	return ax * bx + ay * by + az * bz;
}
function scale(s, [x, y, z]) {
	return [s * x, s * y, s * z];
}
function add3([ax, ay, az], [bx, by, bz]) {
	return [ax + bx, ay + by, az + bz];
}
function reflect(n, l, nl) {
	return add3(l, scale(2, add3(scale(nl, n), scale(-1, l))));
}
function light(v, n, l, iDiffuse, iSpecular, kSpecular) {
	const nl = dot(n, l);
	const r = reflect(n, l, nl);
	const vr = dot(v, r);
	const diffuse = Math.max(nl, 0) * iDiffuse;
	const specular = Math.pow(Math.max(vr, 0), kSpecular) * iSpecular;
	return [diffuse, specular];
}
function add2([a0, a1], [b0, b1]) {
	return [a0 + b0, a1 + b1];
}
