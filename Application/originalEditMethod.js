employeeModel.find(
		{
			id : req.params.userId
		},
		function(err, originalUser) {
			if (err)
				console.log(err);

			if (originalUser[0].managerid == -1) {
				
				if (req.body.managerid == -1) {
					employeeModel.findOneAndUpdate(
						{
							id : req.params.userId
						},
						{
							$set : {
								firstName : req.body.firstName,
								lastName : req.body.lastName, 
								startDate : req.body.startDate, 
								officePhone : req.body.officePhone, 
								cellPhone : req.body.cellPhone, 
								email : req.body.email,
								sex : req.body.sex,
								title : req.body.title
							}
						}, function(err) {
							if (err)
								console.log(err);

							employeeRelation.findOneAndUpdate(
								{
									id : req.params.userId
								},
								{
									$set : {
										firstName : req.body.firstName,
										lastName : req.body.lastName
									}
								},
								function(err) {
									if (err) 
										console.log(err);
									// res.json("Message : Update success");
									employeeRelation.update(
										{
											manager : req.params.userId
										},
										{
											$set : {
												managerName : req.body.firstName + ' ' + req.body.lastName
											}
										},
										{
											multi : true
										},
										function(err) {
											if (err) 
												console.log(err);
											res.json("Message : Update success");
										}
									);
								}
							);
						}
					);

				} else {
					employeeModel.findOneAndUpdate(
						{
							id : req.params.userId
						},
						{
							$set : {
								firstName : req.body.firstName,
								lastName : req.body.lastName, 
								startDate : req.body.startDate, 
								officePhone : req.body.officePhone, 
								cellPhone : req.body.cellPhone, 
								email : req.body.email,
								sex : req.body.sex,
								title : req.body.title,
								managerid : req.body.managerId
							}
						},
						function(err) {
							if (err)
								console.log(err);

							employeeRelation.findOneAndUpdate(
								{
									id : req.params.userId
								},
								{
									$set : {
										firstName : req.body.firstName,
										lastName : req.body.lastName,
										manager : req.body.managerid,
										title : req.body.title
									}
								},
								function(err) {
									if (err) 
										console.log(err);
									// res.json("Message : Update success");
									employeeRelation.findOneAndUpdate(
										{
											id : req.body.managerid
										},
										{
											$push : {
												reportTo : req.params.userId,
												nameOfReportTo : req.body.firstName + ' ' + req.body.lastName
											}
										},
										function(err) {
											if (err)
												console.log(err);

											employeeRelation.find(
												{
													id : req.body.managerid
												},
												function(err, nowManager) {
													if (err)
														console.log(err);

													employeeRelation.findOneAndUpdate(
														{
															id : req.params.userId
														},
														{
															$set : {
																managerName : nowManager[0].firstName + ' ' + nowManager[0].lastName
															}
														},
														function(err) {
															if (err)
																console.log(err)

															// res.json("Message : Update success");
															employeeRelation.update(
																{
																	manager : req.params.userId
																},
																{
																	$set : {
																		managerName : req.body.firstName + ' ' + req.body.lastName
																	}
																},
																{
																	multi : true
																},
																function(err) {
																	if (err) 
																		console.log(err);
																	res.json("Message : Update success");
																}
															);
														}
													);
												}
											);
										}
									);
								}
							);
						}
					);
				}

			} else {
				if (req.body.managerid == -1) {
					employeeModel.findOneAndUpdate(
						{
							id : req.params.userId
						},
						{
							$set : {
								firstName : req.body.firstName,
								lastName : req.body.lastName, 
								startDate : req.body.startDate, 
								officePhone : req.body.officePhone, 
								cellPhone : req.body.cellPhone, 
								email : req.body.email,
								sex : req.body.sex,
								title : req.body.title,
								managerid : req.body.managerId
							}
						},
						function(err) {
							if (err)
								console.log(err);

							employeeRelation.findOneAndUpdate(
								{
									id : req.params.userId
								},
								{
									$set : {
										firstName : req.body.firstName,
										lastName : req.body.lastName,
										manager : req.body.managerid,
										title : req.body.title,
										managerName : ' '
									}
								},
								function(err) {
									if (err)
										console.log(err);

									employeeRelation.findOneAndUpdate(
										{
											id : originalUser[0].managerid
										},
										{
											$pull : {
												reportTo : req.params.userId,
												nameOfReportTo : originalUser[0].firstName + ' ' + originalUser[0].lastName
											}
										},
										function(err) {
											if (err)
												console.log(err);

											employeeRelation.update(
												{
													manager : req.params.userId
												},
												{
													$set : {
														managerName : req.body.firstName + ' ' + req.body.lastName
													}
												},
												{
													multi : true
												},
												function(err) {
													if (err) 
														console.log(err);
													res.json("Message : Update success");
												}
											);
										}
									);
								}
							);
						}
					);
				} else {
					if (originalUser[0].managerid == req.body.managerid) {
						employeeModel.findOneAndUpdate(
							{
								id : req.params.userId
							},
							{
								$set : {
									firstName : req.body.firstName,
									lastName : req.body.lastName, 
									startDate : req.body.startDate, 
									officePhone : req.body.officePhone, 
									cellPhone : req.body.cellPhone, 
									email : req.body.email,
									sex : req.body.sex,
									title : req.body.title,
									managerid : req.body.managerId
								}
							},
							function(err) {
								if (err)
									console.log(err);

								employeeRelation.findOneAndUpdate(
									{
										id : req.params.userId
									},
									{
										$set : {
											firstName : req.body.firstName,
											lastName : req.body.lastName,											
											title : req.body.title,											
										}
									},
									function(err) {
										if (err)
											console.log(err);

										employeeRelation.findOneAndUpdate(
											{
												id : req.body.managerid
											},
											{
												$pull : {
													nameOfReportTo : originalUser[0].firstName + ' ' + originalUser[0].lastName
												}
											},
											function(err) {
												if (err)
													console.log(err);
												employeeRelation.findOneAndUpdate(
													{
														id : req.body.managerid
													},
													{
														$push : {
															nameOfReportTo : req.body.firstName + ' ' + req.body.lastName
														}
													},
													function(err) {
														if (err)
															console.log(err);

														employeeRelation.update(
															{
																manager : req.params.userId
															},
															{
																$set : {
																	managerName : req.body.firstName + ' ' + req.body.lastName
																}
															},
															{
																multi : true
															},
															function(err) {
																if (err) 
																	console.log(err);
																res.json("Message : Update success");
															}
														);
													}
												);
											}
										);
									}
								);
							}
						);
					} else {
						employeeModel.findOneAndUpdate(
							{
								id : req.params.userId
							},
							{
								$set : {
									firstName : req.body.firstName,
									lastName : req.body.lastName, 
									startDate : req.body.startDate, 
									officePhone : req.body.officePhone, 
									cellPhone : req.body.cellPhone, 
									email : req.body.email,
									sex : req.body.sex,
									title : req.body.title,
									managerid : req.body.managerId
								}
							},
							function(err) {
								if (err) 
									console.log(err);

								employeeRelation.find(
									{
										id : req.body.managerid
									},
									function(err, newManager) {
										if (err)
											console.log(err);

										employeeRelation.findOneAndUpdate(
											{
												id : req.params.userId
											},
											{
												$set : {
													firstName : req.body.firstName,
													lastName : req.body.lastName,											
													title : req.body.title,	
													manager : req.body.managerid,
													managerName : newManager[0].firstName + ' ' + newManager[0].lastName										
												}
											},
											function(err) {
												if (err) 
													console.log(err);

												employeeRelation.findOneAndUpdate(
													{
														id : originalUser[0].managerid
													},
													{
														$pull : {
															reportTo : req.params.userId,
															nameOfReportTo : originalUser[0].firstName + ' ' + originalUser[0].lastName
														}
													},
													function(err) {
														if (err)
															console.log(err);

														employeeRelation.findOneAndUpdate(
															{
																id : req.body.managerid
															},
															{
																$push : {
																	reportTo : req.params.userId,
																	nameOfReportTo : req.body.firstName + req.body.lastName
																}
															},
															function(err) {
																if (err) 
																	console.log(err);

																employeeRelation.update(
																	{
																		manager : req.params.userId
																	},
																	{
																		$set : {
																			managerName : req.body.firstName + ' ' + req.body.lastName
																		}
																	},
																	{
																		multi : true
																	},
																	function(err) {
																		if (err) 
																			console.log(err);
																		res.json("Message : Update success");
																	}
																);
															}
														);
													}
												);
											}
										);
									}
								);
							}
						);
					}
				}
			}
		}
	);